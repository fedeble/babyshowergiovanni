"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type AdminRealtimeRefreshProps = {
  eventId: string;
  giftIds: string[];
  scope: "dashboard" | "gifts" | "reservations";
};

export default function AdminRealtimeRefresh({
  eventId,
  giftIds,
  scope,
}: AdminRealtimeRefreshProps) {
  const router = useRouter();
  const giftIdsKey = [...giftIds].sort().join(",");

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    const relevantGiftIds = new Set(giftIdsKey ? giftIdsKey.split(",") : []);
    let refreshTimeout: ReturnType<typeof setTimeout> | undefined;
    const refresh = () => {
      clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => router.refresh(), 120);
    };
    let channel = supabase
      .channel(`admin:${scope}:${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "gifts",
          filter: `event_id=eq.${eventId}`,
        },
        refresh,
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "gifts",
          filter: `event_id=eq.${eventId}`,
        },
        refresh,
      );

    for (const giftId of relevantGiftIds) {
      channel = channel.on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "gift_reservations",
          filter: `gift_id=eq.${giftId}`,
        },
        refresh,
      );
    }

    channel.subscribe();

    return () => {
      clearTimeout(refreshTimeout);
      void supabase.removeChannel(channel);
    };
  }, [eventId, giftIdsKey, router, scope]);

  return null;
}