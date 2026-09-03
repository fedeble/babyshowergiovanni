import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

type AdminEvent = Pick<
  Database["public"]["Tables"]["events"]["Row"],
  "id" | "name" | "baby_name" | "event_date" | "event_time" | "venue" | "address"
>;

export type AdminDashboardData = {
  event: AdminEvent;
  giftIds: string[];
  gifts: number;
  totalUnits: number;
  reservedUnits: number;
  availableUnits: number;
  reservations: number;
  isEventComplete: boolean;
};

export type AdminDashboardResult =
  | { status: "ready"; data: AdminDashboardData }
  | { status: "empty" }
  | { status: "error" };

export async function getAdminDashboardData(
  supabase: SupabaseClient<Database>,
  eventId: string,
): Promise<AdminDashboardResult> {
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id,name,baby_name,event_date,event_time,venue,address")
    .eq("id", eventId)
    .maybeSingle();

  if (eventError) {
    return { status: "error" };
  }

  if (!event) {
    return { status: "empty" };
  }

  const giftsResult = await supabase
    .from("gifts")
    .select("id,quantity,reserved_quantity")
    .eq("event_id", event.id);

  if (giftsResult.error) {
    return { status: "error" };
  }

  const giftIds = giftsResult.data.map((gift) => gift.id);
  const reservationsResult = giftIds.length
    ? await supabase
        .from("gift_reservations")
        .select("id", { count: "exact", head: true })
        .in("gift_id", giftIds)
    : { count: 0, error: null };

  if (reservationsResult.error) {
    return { status: "error" };
  }

  const totals = (giftsResult.data ?? []).reduce(
    (current, gift) => ({
      total: current.total + gift.quantity,
      reserved: current.reserved + gift.reserved_quantity,
    }),
    { total: 0, reserved: 0 },
  );

  return {
    status: "ready",
    data: {
      event,
      giftIds,
      gifts: giftsResult.data?.length ?? 0,
      totalUnits: totals.total,
      reservedUnits: totals.reserved,
      availableUnits: totals.total - totals.reserved,
      reservations: reservationsResult.count ?? 0,
      isEventComplete: Boolean(
        event.event_date && event.event_time && event.venue && event.address,
      ),
    },
  };
}