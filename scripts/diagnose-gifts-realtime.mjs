import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey || !serviceKey) {
  console.error("Faltan variables de Supabase.");
  process.exit(1);
}

const options = { auth: { autoRefreshToken: false, persistSession: false } };
const anon = createClient(url, anonKey, options);
const admin = createClient(url, serviceKey, options);
const id = randomUUID();
let eventId;

function subscribe(client, name, filter) {
  let resolveEvent;
  const event = new Promise((resolve) => {
    resolveEvent = resolve;
  });
  const config = { event: "UPDATE", schema: "public", table: "gifts" };

  if (filter) {
    config.filter = filter;
  }

  const channel = client
    .channel(`${name}:${id}`)
    .on("postgres_changes", config, (payload) => resolveEvent(payload.new));

  const ready = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`${name}: timeout de suscripción`)), 10_000);
    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        clearTimeout(timeout);
        resolve();
      } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        clearTimeout(timeout);
        reject(new Error(`${name}: ${status}`));
      }
    });
  });

  return { channel, client, event, name, ready };
}

async function run() {
  const { data: event, error: eventError } = await admin
    .from("events")
    .insert({ name: `Diagnóstico Realtime ${id}`, baby_name: "TEST" })
    .select("id")
    .single();
  if (eventError) throw eventError;
  eventId = event.id;

  const { data: gift, error: giftError } = await admin
    .from("gifts")
    .insert({ event_id: eventId, name: `Diagnóstico ${id}`, quantity: 2 })
    .select("id")
    .single();
  if (giftError) throw giftError;

  const observers = [
    subscribe(anon, "anon-filtered", `event_id=eq.${eventId}`),
    subscribe(anon, "anon-unfiltered"),
    subscribe(admin, "service-unfiltered"),
  ];

  await Promise.all(observers.map((observer) => observer.ready));

  const { error: updateError } = await admin
    .from("gifts")
    .update({ reserved_quantity: 1 })
    .eq("id", gift.id);
  if (updateError) throw updateError;

  const results = await Promise.all(
    observers.map(async (observer) => {
      const received = await Promise.race([
        observer.event.then(() => true),
        new Promise((resolve) => setTimeout(() => resolve(false), 8_000)),
      ]);
      return { name: observer.name, received };
    }),
  );

  for (const result of results) {
    console.log(`${result.name}: ${result.received ? "evento recibido" : "sin evento"}`);
  }

  await Promise.all(observers.map((observer) => observer.client.removeChannel(observer.channel)));
  return results;
}

async function cleanup() {
  if (!eventId) return;
  const { data: gifts } = await admin.from("gifts").select("id").eq("event_id", eventId);
  if (gifts?.length) {
    await admin.from("gift_reservations").delete().in("gift_id", gifts.map((gift) => gift.id));
  }
  await admin.from("gifts").delete().eq("event_id", eventId);
  await admin.from("events").delete().eq("id", eventId);
}

try {
  const results = await run();
  process.exitCode = results.every((result) => result.received) ? 0 : 1;
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await cleanup();
}

process.exit(process.exitCode ?? 0);
