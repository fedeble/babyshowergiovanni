"use client";

import { motion, useReducedMotion } from "framer-motion";
import { invitationConfig, type InvitationGift } from "@/lib/invitation-config";

export type GiftStatus = "Disponible" | "Parcialmente reservado" | "Agotado" | "A confirmar";

export type Gift = InvitationGift;

type GiftCardProps = {
  gift: Gift;
};

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

export default function GiftCard({ gift }: GiftCardProps) {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = reduceMotion === false;
  const reservedQuantity = gift.totalQuantity !== null && gift.availableQuantity !== null
    ? gift.totalQuantity - gift.availableQuantity
    : null;
  const progress = reservedQuantity !== null && gift.totalQuantity !== null && gift.totalQuantity > 0
    ? Math.round((reservedQuantity / gift.totalQuantity) * 100)
    : null;
  const status = getStatus(gift.totalQuantity, gift.availableQuantity);

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
        <button className="gift-button" type="button">{invitationConfig.gifts.actionLabel}</button>
      </div>
    </article>
  );
}