"use client";

import { useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { invitationConfig, type InvitationGift } from "@/lib/invitation-config";

export type GiftStatus = "Disponible" | "No disponible";

export type Gift = InvitationGift;

type GiftCardProps = {
  canReserve: boolean;
  gift: Gift;
  reservation?: {
    id: string;
    active: boolean;
  };
  onReserve: (
    giftId: string,
    guestName: string,
    quantity: number,
  ) => Promise<ReservationResult>;
};

export type ReservationResult =
  | { success: true; reservationId: string }
  | { success: false; reason: "invalid" | "stock" | "generic" };

export default function GiftCard({ canReserve, gift, reservation, onReserve }: GiftCardProps) {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = reduceMotion === false;
  const submittingRef = useRef(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [imageError, setImageError] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string }>();
  const status: GiftStatus = gift.isAvailable && gift.availableQuantity !== null && gift.availableQuantity > 0
    ? "Disponible"
    : "No disponible";
  const isAvailable = canReserve && gift.isAvailable && gift.availableQuantity !== null && gift.availableQuantity > 0;
  const reservationCopy = invitationConfig.gifts.reservation;
  const visibleMessage = reservation && !reservation.active && message?.type === "success"
    ? undefined
    : message;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submittingRef.current) {
      return;
    }

    const normalizedName = guestName.trim();
    const requestedQuantity = Number(quantity);

    if (normalizedName.length < 2 || normalizedName.length > 120) {
      setMessage({ type: "error", text: reservationCopy.invalidNameMessage });
      return;
    }

    if (
      !Number.isInteger(requestedQuantity) ||
      requestedQuantity <= 0 ||
      gift.availableQuantity === null ||
      requestedQuantity > gift.availableQuantity
    ) {
      setMessage({ type: "error", text: reservationCopy.invalidQuantityMessage });
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    setMessage(undefined);
    let result: ReservationResult;

    try {
      result = await onReserve(gift.id, normalizedName, requestedQuantity);
    } catch {
      result = { success: false, reason: "generic" };
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }

    if (result.success) {
      setGuestName("");
      setQuantity("1");
      setIsFormOpen(false);
      setMessage({ type: "success", text: reservationCopy.successMessage });
      return;
    }

    const errorMessages = {
      invalid: reservationCopy.invalidQuantityMessage,
      stock: reservationCopy.stockErrorMessage,
      generic: reservationCopy.genericErrorMessage,
    };
    setMessage({ type: "error", text: errorMessages[result.reason] });
  }

  return (
    <article className="gift-card">
      <div
        className="gift-image"
        role="img"
        aria-label={`Imagen de ${gift.name}`}
      >
        {gift.image !== null && gift.image.trim() !== "" && !imageError ? (
          <Image
            className="gift-image-source"
            src={gift.image}
            alt=""
            fill
            sizes="(min-width: 900px) 30vw, (min-width: 640px) 45vw, 100vw"
            unoptimized
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="gift-image-placeholder" aria-hidden="true">♡</span>
        )}
        <span className={`gift-status gift-status-${status === "Disponible" ? "available" : "unavailable"}`}>
          <span className="gift-status-heart" aria-hidden="true">♥</span>
          {` ${status}`}
        </span>
      </div>
      <div className="gift-card-body">
        <div className="gift-card-heading">
          <h3 className="gift-name">{gift.name}</h3>
        </div>
        <p className="gift-description">{gift.description}</p>
        <div className="gift-decoration" aria-hidden="true">
          <span />
          <i>♥</i>
          <span />
        </div>
        <button
          className="gift-button"
          type="button"
          disabled={!isAvailable || isSubmitting}
          aria-expanded={isFormOpen}
          aria-controls={`reservation-${gift.id}`}
          onClick={() => {
            setIsFormOpen((current) => !current);
            setMessage(undefined);
          }}
        >
          {invitationConfig.gifts.actionLabel}
        </button>
        <AnimatePresence initial={false}>
          {isFormOpen && isAvailable && (
            <motion.form
              id={`reservation-${gift.id}`}
              className="gift-reservation-form"
              onSubmit={handleSubmit}
              initial={shouldAnimate ? { height: 0, opacity: 0 } : false}
              animate={{ height: "auto", opacity: 1 }}
              exit={shouldAnimate ? { height: 0, opacity: 0 } : undefined}
              transition={shouldAnimate ? { duration: 0.2, ease: "easeOut" } : { duration: 0 }}
            >
              <label className="gift-field">
                <span>{reservationCopy.guestNameLabel}</span>
                <input
                  name="guestName"
                  type="text"
                  value={guestName}
                  minLength={2}
                  maxLength={120}
                  autoComplete="name"
                  disabled={isSubmitting}
                  onChange={(event) => setGuestName(event.target.value)}
                />
              </label>
              <label className="gift-field">
                <span>{reservationCopy.quantityLabel}</span>
                <input
                  name="quantity"
                  type="number"
                  value={quantity}
                  min={1}
                  max={gift.availableQuantity ?? 1}
                  step={1}
                  inputMode="numeric"
                  disabled={isSubmitting}
                  onChange={(event) => setQuantity(event.target.value)}
                />
              </label>
              <button className="gift-submit-button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? reservationCopy.submittingLabel : reservationCopy.submitLabel}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
        {visibleMessage && (
          <p className={`gift-reservation-message gift-reservation-message-${visibleMessage.type}`} role={visibleMessage.type === "error" ? "alert" : "status"}>
            {visibleMessage.text}
          </p>
        )}
      </div>
    </article>
  );
}