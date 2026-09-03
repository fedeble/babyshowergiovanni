"use client";

import { useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { invitationConfig, type InvitationGift } from "@/lib/invitation-config";

export type GiftStatus = "Disponible" | "Parcialmente reservado" | "Agotado" | "A confirmar";

export type Gift = InvitationGift;

type GiftCardProps = {
  canReserve: boolean;
  gift: Gift;
  onReserve: (
    giftId: string,
    guestName: string,
    quantity: number,
  ) => Promise<ReservationResult>;
};

export type ReservationResult =
  | { success: true }
  | { success: false; reason: "invalid" | "stock" | "generic" };

function getStatus(totalQuantity: number | null, availableQuantity: number | null): GiftStatus {
  if (totalQuantity === null || availableQuantity === null) {
    return "A confirmar";
  }

  if (availableQuantity === 0) {
    return "Agotado";
  }

  if (availableQuantity < totalQuantity) {
    return "Parcialmente reservado";
  }

  return "Disponible";
}

export default function GiftCard({ canReserve, gift, onReserve }: GiftCardProps) {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = reduceMotion === false;
  const submittingRef = useRef(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string }>();
  const reservedQuantity = gift.totalQuantity !== null && gift.availableQuantity !== null
    ? gift.totalQuantity - gift.availableQuantity
    : null;
  const progress = reservedQuantity !== null && gift.totalQuantity !== null && gift.totalQuantity > 0
    ? Math.round((reservedQuantity / gift.totalQuantity) * 100)
    : null;
  const status = getStatus(gift.totalQuantity, gift.availableQuantity);
  const isAvailable = canReserve && gift.availableQuantity !== null && gift.availableQuantity > 0;
  const reservationCopy = invitationConfig.gifts.reservation;

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
        style={{ backgroundImage: `url(${gift.imageUrl})` }}
      />
      <div className="gift-card-body">
        <div className="gift-card-heading">
          <h3 className="gift-name">{gift.name}</h3>
          <span className={`gift-status gift-status-${status.toLowerCase().replaceAll(" ", "-")}`}>
            {status}
          </span>
        </div>
        <p className="gift-description">{gift.description}</p>
        <div className="gift-quantity-row">
          <span>Cantidad total: {gift.totalQuantity ?? "A confirmar"}</span>
          <span>Disponible: {gift.availableQuantity ?? "A confirmar"}</span>
        </div>
        <div className="gift-progress-track" aria-label={progress === null ? "Progreso a confirmar" : `${progress}% reservado`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress ?? undefined}>
          <motion.div
            className="gift-progress-bar"
            initial={shouldAnimate ? { width: 0 } : false}
            whileInView={progress === null ? undefined : { width: `${progress}%` }}
            viewport={{ once: true }}
            transition={shouldAnimate ? { duration: 0.55, ease: "easeOut" } : { duration: 0 }}
          />
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
        {message && (
          <p className={`gift-reservation-message gift-reservation-message-${message.type}`} role={message.type === "error" ? "alert" : "status"}>
            {message.text}
          </p>
        )}
      </div>
    </article>
  );
}