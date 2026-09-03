"use server";

import { revalidatePath } from "next/cache";
import { requireAdminContext } from "@/lib/supabase/admin-auth";

export type GiftActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

type GiftInput = {
  name: string;
  description: string | null;
  image: string | null;
  quantity: number;
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function getAdminContext() {
  return requireAdminContext();
}

function readGiftInput(formData: FormData): GiftInput | null {
  const nameValue = formData.get("name");
  const descriptionValue = formData.get("description");
  const imageValue = formData.get("image");
  const quantityValue = formData.get("quantity");

  if (
    typeof nameValue !== "string" ||
    typeof descriptionValue !== "string" ||
    typeof imageValue !== "string" ||
    typeof quantityValue !== "string"
  ) {
    return null;
  }

  const name = nameValue.trim();
  const description = descriptionValue.trim();
  const image = imageValue.trim();
  const quantity = Number(quantityValue);

  if (
    name.length < 1 ||
    name.length > 160 ||
    description.length > 1000 ||
    image.length > 2048 ||
    !Number.isInteger(quantity) ||
    quantity <= 0
  ) {
    return null;
  }

  if (image) {
    try {
      if (new URL(image).protocol !== "https:") {
        return null;
      }
    } catch {
      return null;
    }
  }

  return {
    name,
    description: description || null,
    image: image || null,
    quantity,
  };
}

function finish(message: string): GiftActionState {
  revalidatePath("/admin");
  revalidatePath("/admin/gifts");
  revalidatePath("/");
  return { status: "success", message };
}

export async function createGift(
  _previousState: GiftActionState,
  formData: FormData,
): Promise<GiftActionState> {
  const input = readGiftInput(formData);

  if (!input) {
    return { status: "error", message: "Revisá el nombre, la cantidad y la URL HTTPS." };
  }

  const context = await getAdminContext();

  const { error } = await context.supabase.from("gifts").insert({
    event_id: context.eventId,
    ...input,
  });

  if (error) {
    return { status: "error", message: "No pudimos crear el regalo." };
  }

  return finish("Regalo creado correctamente.");
}

export async function updateGift(
  _previousState: GiftActionState,
  formData: FormData,
): Promise<GiftActionState> {
  const giftId = formData.get("giftId");
  const input = readGiftInput(formData);

  if (typeof giftId !== "string" || !uuidPattern.test(giftId) || !input) {
    return { status: "error", message: "Revisá el nombre, la cantidad y la URL HTTPS." };
  }

  const context = await getAdminContext();

  const { data, error } = await context.supabase
    .from("gifts")
    .update(input)
    .eq("id", giftId)
    .eq("event_id", context.eventId)
    .select("id")
    .maybeSingle();

  if (error?.code === "23514") {
    return {
      status: "error",
      message: "La cantidad total no puede ser menor que las unidades reservadas.",
    };
  }

  if (error || !data) {
    return { status: "error", message: "No pudimos guardar los cambios." };
  }

  return finish("Cambios guardados correctamente.");
}

export async function deleteGift(
  _previousState: GiftActionState,
  formData: FormData,
): Promise<GiftActionState> {
  const giftId = formData.get("giftId");

  if (typeof giftId !== "string" || !uuidPattern.test(giftId)) {
    return { status: "error", message: "No pudimos identificar el regalo." };
  }

  const context = await getAdminContext();

  const { data, error } = await context.supabase
    .from("gifts")
    .delete()
    .eq("id", giftId)
    .eq("event_id", context.eventId)
    .select("id")
    .maybeSingle();

  if (error?.code === "23503") {
    return { status: "error", message: "No se puede eliminar un regalo con reservas." };
  }

  if (error || !data) {
    return { status: "error", message: "No pudimos eliminar el regalo." };
  }

  return finish("Regalo eliminado correctamente.");
}