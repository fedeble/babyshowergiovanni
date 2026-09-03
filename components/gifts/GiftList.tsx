"use client";

import { startTransition, useEffect, useState } from "react";
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

export default function GiftList({ eventId, gifts }: GiftListProps) {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = reduceMotion === false;
  const initialGifts = gifts?.length ? gifts : invitationConfig.gifts.items;
  const [giftItems, setGiftItems] = useState<readonly InvitationGift[]>(initialGifts);

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
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
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

    const { error } = await supabase.rpc("reserve_gift", {
      p_gift_id: giftId,
      p_guest_name: guestName,
      p_requested_quantity: requestedQuantity,
    });

    if (!error) {
      return { success: true };
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
      <motion.div
        className="content-container section-space gifts-content"
        initial={shouldAnimate ? { opacity: 0, y: 28 } : false}
        whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
        viewport={{ once: true, amount: 0.12 }}
        transition={shouldAnimate ? { duration: 0.7, ease: "easeOut" } : { duration: 0 }}
      >
        <div className="text-center">
          <p className="eyebrow">{invitationConfig.gifts.sectionLabel}</p>
          <h2 id="gifts-title" className="section-title">{invitationConfig.gifts.title}</h2>
          <p className="gifts-introduction">{invitationConfig.gifts.introduction}</p>
        </div>
        <div className="gift-list mt-10">
          {giftItems.map((gift) => (
            <GiftCard
              canReserve={Boolean(eventId)}
              gift={gift}
              key={gift.id}
              onReserve={reserveGift}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}