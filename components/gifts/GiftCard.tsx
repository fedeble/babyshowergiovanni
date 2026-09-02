"use client";

import { motion, useReducedMotion } from "framer-motion";

export type GiftStatus = "Disponible" | "Parcialmente reservado" | "Agotado";

export type Gift = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  totalQuantity: number;
  availableQuantity: number;
};

type GiftCardProps = {
  gift: Gift;
};

function getStatus(totalQuantity: number, availableQuantity: number): GiftStatus {
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
  const reservedQuantity = gift.totalQuantity - gift.availableQuantity;
  const progress = (reservedQuantity / gift.totalQuantity) * 100;
  const status = getStatus(gift.totalQuantity, gift.availableQuantity);

  return (
    <article className="gift-card">
      <div
        className="gift-image"
        role="img"
        aria-label={`Imagen placeholder de ${gift.name}`}
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
          <span>Cantidad total: {gift.totalQuantity}</span>
          <span>Disponible: {gift.availableQuantity}</span>
        </div>
        <div className="gift-progress-track" aria-label={`${progress}% reservado`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
          <motion.div
            className="gift-progress-bar"
            initial={reduceMotion ? false : { width: 0 }}
            whileInView={{ width: `${progress}%` }}
            viewport={{ once: true }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.55, ease: "easeOut" }}
          />
        </div>
        <button className="gift-button" type="button">
          Quiero regalarlo
        </button>
      </div>
    </article>
  );
}