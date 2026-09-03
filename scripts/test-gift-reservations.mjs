import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
  console.error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY o SUPABASE_SERVICE_ROLE_KEY.",
  );
  process.exit(1);
}

const clientOptions = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
};
const admin = createClient(supabaseUrl, serviceRoleKey, clientOptions);
const guestA = createClient(supabaseUrl, supabaseAnonKey, clientOptions);
const guestB = createClient(supabaseUrl, supabaseAnonKey, clientOptions);
const testId = randomUUID();
let eventId;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function getGift(client, giftId) {
  const { data, error } = await client
    .from("gifts")
    .select("id,event_id,quantity,reserved_quantity")
    .eq("id", giftId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function reserve(client, giftId, guestName, quantity) {
  return client.rpc("reserve_gift", {
    p_gift_id: giftId,
    p_guest_name: guestName,
    p_requested_quantity: quantity,
  });
}

async function observeRealtimeGift(eventId, giftId) {
  let resolveUpdate;
  let rejectUpdate;
  const update = new Promise((resolve, reject) => {
    resolveUpdate = resolve;
    rejectUpdate = reject;
  });
  const channel = guestA
      .channel(`reservation-test:${testId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "gifts",
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          if (payload.new.id !== giftId) {
            return;
          }

          resolveUpdate(payload.new);
        },
      );

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Realtime no se suscribió dentro de 10 segundos."));
    }, 10_000);

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        clearTimeout(timeout);
        resolve();
      }

      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        clearTimeout(timeout);
        reject(new Error(`No se pudo abrir Realtime: ${status}.`));
      }
    });
  });

  const updateTimeout = setTimeout(() => {
    rejectUpdate(new Error("Realtime no notificó el cambio de gifts dentro de 10 segundos."));
  }, 10_000);

  return {
    update: update.finally(() => clearTimeout(updateTimeout)),
    cleanup: () => guestA.removeChannel(channel),
  };
}

async function run() {
  const { data: event, error: eventError } = await admin
    .from("events")
    .insert({ name: `Prueba reservas ${testId}`, baby_name: "TEST" })
    .select("id")
    .single();

  if (eventError) {
    throw eventError;
  }

  eventId = event.id;

  const { data: gifts, error: giftsError } = await admin
    .from("gifts")
    .insert([
      { event_id: eventId, name: `Flujo normal ${testId}`, quantity: 3 },
      { event_id: eventId, name: `Sobre-stock ${testId}`, quantity: 1 },
      { event_id: eventId, name: `Concurrencia ${testId}`, quantity: 1 },
    ])
    .select("id,name,quantity,reserved_quantity");

  if (giftsError) {
    throw giftsError;
  }

  const normalGift = gifts.find((gift) => gift.name.startsWith("Flujo normal"));
  const stockGift = gifts.find((gift) => gift.name.startsWith("Sobre-stock"));
  const concurrentGift = gifts.find((gift) => gift.name.startsWith("Concurrencia"));
  assert(normalGift && stockGift && concurrentGift, "No se crearon todos los fixtures.");

  const { data: loadedGifts, error: loadError } = await guestA
    .from("gifts")
    .select("id,quantity,reserved_quantity")
    .eq("event_id", eventId);
  assert(!loadError && loadedGifts.length === 3, "La carga pública de regalos falló.");
  console.log("✓ Carga pública de regalos");

  const realtimeObserver = await observeRealtimeGift(eventId, normalGift.id);
  let realtimeGift;
  let realtimeError;

  try {
    const normalReservation = await reserve(guestA, normalGift.id, "Invitado Prueba", 1);
    assert(!normalReservation.error, `La reserva válida falló: ${normalReservation.error?.message}`);

    try {
      realtimeGift = await realtimeObserver.update;
    } catch (error) {
      realtimeError = error;
    }
  } finally {
    await realtimeObserver.cleanup();
  }

  if (realtimeGift) {
    assert(realtimeGift.reserved_quantity === 1, "Realtime publicó una cantidad incorrecta.");
  }

  const normalAfter = await getGift(guestA, normalGift.id);
  assert(normalAfter.reserved_quantity === 1, "La disponibilidad no se actualizó tras reservar.");
  console.log("✓ Reserva, confirmación y disponibilidad");

  const overStock = await reserve(guestA, stockGift.id, "Invitado Prueba", 2);
  assert(overStock.error?.code === "P0001", "La RPC no rechazó una cantidad mayor al stock.");
  const stockAfter = await getGift(guestA, stockGift.id);
  assert(stockAfter.reserved_quantity === 0, "El rechazo de stock modificó el regalo.");
  console.log("✓ Rechazo de sobre-stock y reconciliación desde gifts");

  const invalidQuantity = await reserve(guestA, stockGift.id, "Invitado Prueba", 0);
  const invalidName = await reserve(guestA, stockGift.id, "A", 1);
  assert(invalidQuantity.error?.code === "22023", "La RPC aceptó una cantidad inválida.");
  assert(invalidName.error?.code === "22023", "La RPC aceptó un nombre inválido.");
  console.log("✓ Validaciones de nombre y cantidad");

  const concurrentResults = await Promise.all([
    reserve(guestA, concurrentGift.id, "Invitado A", 1),
    reserve(guestB, concurrentGift.id, "Invitado B", 1),
  ]);
  const successes = concurrentResults.filter((result) => !result.error);
  const stockErrors = concurrentResults.filter((result) => result.error?.code === "P0001");
  const concurrentAfter = await getGift(guestA, concurrentGift.id);
  assert(successes.length === 1, "El doble envío no produjo exactamente una reserva.");
  assert(stockErrors.length === 1, "El doble envío no rechazó la segunda reserva por stock.");
  assert(concurrentAfter.reserved_quantity === 1, "La concurrencia superó quantity.");
  console.log("✓ Concurrencia, doble envío y límite de quantity");

  if (realtimeError) {
    throw realtimeError;
  }

  console.log("✓ Realtime");
}

async function cleanup() {
  if (!eventId) {
    return;
  }

  const { data: giftIds } = await admin.from("gifts").select("id").eq("event_id", eventId);

  if (giftIds?.length) {
    await admin
      .from("gift_reservations")
      .delete()
      .in("gift_id", giftIds.map((gift) => gift.id));
  }

  await admin.from("gifts").delete().eq("event_id", eventId);
  await admin.from("events").delete().eq("id", eventId);
}

try {
  await run();
  console.log("\nPrueba funcional completada correctamente.");
} catch (error) {
  console.error("\nPrueba funcional fallida:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await cleanup();
}

process.exit(process.exitCode ?? 0);
