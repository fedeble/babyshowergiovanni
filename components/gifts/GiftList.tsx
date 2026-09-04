"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import GiftCard, { type ReservationResult } from "./GiftCard";
import { invitationConfig, type InvitationGift } from "@/lib/invitation-config";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type GiftListProps = {
  eventId?: string | null;
  gifts?: readonly InvitationGift[];
};

type RealtimeGift = {
  id: string;
  event_id: string;
  quantity: number;
  reserved_quantity: number;
};

type GiftStatusUpdate = {
  id: string;
  quantity: number;
  reserved_quantity: number;
  is_available: boolean;
};

type LocalReservation = {
  id: string;
  active: boolean;
};

export default function GiftList({ eventId, gifts }: GiftListProps) {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = reduceMotion === false;
  const initialGifts = gifts?.length ? gifts : invitationConfig.gifts.items;
  const [giftItems, setGiftItems] = useState<readonly InvitationGift[]>(initialGifts);
  const [localReservations, setLocalReservations] = useState<Record<string, LocalReservation>>({});
  const localReservationsRef = useRef<Record<string, LocalReservation>>({});
  const sortedGiftItems = giftItems
    .map((gift, index) => ({ gift, index }))
    .sort((left, right) => {
      const rightIsAvailable =
        right.gift.isAvailable === true && (right.gift.availableQuantity ?? 0) > 0;
      const leftIsAvailable =
        left.gift.isAvailable === true && (left.gift.availableQuantity ?? 0) > 0;
      const availabilityOrder = Number(rightIsAvailable) - Number(leftIsAvailable);
      return availabilityOrder || left.index - right.index;
    })
    .map(({ gift }) => gift);

  function updateLocalReservation(giftId: string, reservation: LocalReservation) {
    const nextReservations = {
      ...localReservationsRef.current,
      [giftId]: reservation,
    };
    localReservationsRef.current = nextReservations;
    setLocalReservations(nextReservations);
  }

  async function verifyLocalReservations(supabase: ReturnType<typeof createBrowserSupabaseClient>) {
    const trackedReservations = Object.entries(localReservationsRef.current).filter(
      ([, reservation]) => reservation.active,
    );

    if (!trackedReservations.length) {
      return;
    }

    const results = await Promise.all(
      trackedReservations.map(async ([giftId, reservation]) => {
        const { data, error } = await supabase.rpc("gift_reservation_exists", {
          p_reservation_id: reservation.id,
        });

        return { giftId, reservationId: reservation.id, exists: error ? null : data };
      }),
    );

    const nextReservations = { ...localReservationsRef.current };
    let changed = false;

    for (const result of results) {
      if (
        result.exists === false &&
        nextReservations[result.giftId]?.id === result.reservationId
      ) {
        nextReservations[result.giftId] = {
          id: result.reservationId,
          active: false,
        };
        changed = true;
      }
    }

    if (changed) {
      localReservationsRef.current = nextReservations;
      setLocalReservations(nextReservations);
    }
  }

  useEffect(() => {
    if (!eventId) {
      return;
    }

    const supabase = createBrowserSupabaseClient();
    const channel = supabase
      .channel(`gifts:${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "gifts",
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          const updatedGift = payload.new as RealtimeGift;

          startTransition(() => {
            setGiftItems((currentGifts) =>
              currentGifts.map((gift) =>
                gift.id === updatedGift.id
                  ? {
                      ...gift,
                      totalQuantity: updatedGift.quantity,
                      availableQuantity: Math.max(
                        0,
                        updatedGift.quantity - updatedGift.reserved_quantity,
                      ),
                    }
                  : gift,
              ),
            );
          });

          void verifyLocalReservations(supabase);
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [eventId]);

  useEffect(() => {
    if (!eventId) {
      return;
    }

    const currentEventId = eventId;
    let isActive = true;
    const supabase = createBrowserSupabaseClient();

    async function refreshGiftStatuses() {
      const { data, error } = await supabase
        .from("gifts")
        .select("id,quantity,reserved_quantity,is_available")
        .eq("event_id", currentEventId)
        .returns<GiftStatusUpdate[]>();

      if (!isActive || error || !data) {
        return;
      }

      startTransition(() => {
        setGiftItems((currentGifts) =>
          currentGifts.map((gift) => {
            const updatedGift = data.find((candidate) => candidate.id === gift.id);

            if (!updatedGift) {
              return gift;
            }

            return {
              ...gift,
              availableQuantity: Math.max(
                0,
                updatedGift.quantity - updatedGift.reserved_quantity,
              ),
              isAvailable: updatedGift.is_available,
              totalQuantity: updatedGift.quantity,
            };
          }),
        );
      });

      await verifyLocalReservations(supabase);
    }

    const intervalId = window.setInterval(() => {
      void refreshGiftStatuses();
    }, 5000);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, [eventId]);

  async function reserveGift(
    giftId: string,
    guestName: string,
    requestedQuantity: number,
  ): Promise<ReservationResult> {
    if (!eventId) {
      return { success: false, reason: "generic" };
    }

    const supabase = createBrowserSupabaseClient();

    setGiftItems((currentGifts) =>
      currentGifts.map((gift) =>
        gift.id === giftId && gift.availableQuantity !== null
          ? {
              ...gift,
              availableQuantity: Math.max(0, gift.availableQuantity - requestedQuantity),
            }
          : gift,
      ),
    );

    const { data: reservationId, error } = await supabase.rpc("reserve_gift", {
      p_gift_id: giftId,
      p_guest_name: guestName,
      p_requested_quantity: requestedQuantity,
    });

    if (!error && typeof reservationId === "string") {
      updateLocalReservation(giftId, { id: reservationId, active: true });
      return { success: true, reservationId };
    }

    const { data: currentGift } = await supabase
      .from("gifts")
      .select("quantity,reserved_quantity")
      .eq("id", giftId)
      .maybeSingle<{ quantity: number; reserved_quantity: number }>();

    setGiftItems((currentGifts) =>
      currentGifts.map((gift) => {
        if (gift.id !== giftId) {
          return gift;
        }

        if (currentGift) {
          return {
            ...gift,
            totalQuantity: currentGift.quantity,
            availableQuantity: Math.max(
              0,
              currentGift.quantity - currentGift.reserved_quantity,
            ),
          };
        }

        return {
          ...gift,
          availableQuantity:
            gift.availableQuantity === null
              ? null
              : Math.min(
                  gift.totalQuantity ?? Number.POSITIVE_INFINITY,
                  gift.availableQuantity + requestedQuantity,
                ),
        };
      }),
    );

    if (error.code === "P0001") {
      return { success: false, reason: "stock" };
    }

    if (error.code === "22023") {
      return { success: false, reason: "invalid" };
    }

    return { success: false, reason: "generic" };
  }

  return (
    <section className="section-shell section-light" aria-labelledby="gifts-title">
      <div className="content-container section-space gifts-content">
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 28 } : false}
          whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true, amount: 0.12 }}
          transition={shouldAnimate ? { duration: 0.7, ease: "easeOut" } : { duration: 0 }}
        >
        <div className="text-center">
          <p className="eyebrow">{invitationConfig.gifts.sectionLabel}</p>
          <h2 id="gifts-title" className="section-title font-section-title">{invitationConfig.gifts.title}</h2>
          <p className="gifts-introduction">{invitationConfig.gifts.introduction}</p>
        </div>
        </motion.div>
        <div className="gift-list mt-10">
          {sortedGiftItems.map((gift) => (
            <GiftCard
              canReserve={Boolean(eventId)}
              gift={gift}
              key={gift.id}
              reservation={localReservations[gift.id]}
              onReserve={reserveGift}
            />
          ))}
        </div>
      </div>
    </section>
  );
}