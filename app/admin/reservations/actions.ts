"use server";

import { revalidatePath } from "next/cache";
import { requireAdminContext } from "@/lib/supabase/admin-auth";

export type ReservationActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function cancelReservation(
  _previousState: ReservationActionState,
  formData: FormData,
): Promise<ReservationActionState> {
  const reservationId = formData.get("reservationId");

  if (typeof reservationId !== "string" || !uuidPattern.test(reservationId)) {
    return { status: "error", message: "No pudimos identificar la reserva." };
  }

  const { supabase } = await requireAdminContext();

  const { error } = await supabase.rpc("cancel_gift_reservation", {
    p_reservation_id: reservationId,
  });

  if (error?.code === "P0002") {
    return { status: "error", message: "La reserva ya no existe." };
  }

  if (error) {
    return { status: "error", message: "No pudimos anular la reserva." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/gifts");
  revalidatePath("/admin/reservations");
  revalidatePath("/");

  return { status: "success", message: "Reserva anulada correctamente." };
}