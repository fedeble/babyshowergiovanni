"use client";

import { motion, useReducedMotion } from "framer-motion";
import GiftCard, { type Gift } from "./GiftCard";

const mockGifts: Gift[] = [
  {
    id: "gift-blanket",
    name: "Manta de bebé",
    description: "Imagen, nombre y datos de ejemplo para reemplazar posteriormente.",
    imageUrl: "https://images.unsplash.com/photo-1584839404042-8bc21d24075c?auto=format&fit=crop&w=900&q=85",
    totalQuantity: 2,
    availableQuantity: 2,
  },
  {
    id: "gift-bottle",
    name: "Set de biberones",
    description: "Imagen, nombre y datos de ejemplo para reemplazar posteriormente.",
    imageUrl: "https://images.unsplash.com/photo-1604917621956-10dfa7cce2e7?auto=format&fit=crop&w=900&q=85",
    totalQuantity: 3,
    availableQuantity: 1,
  },
  {
    id: "gift-basket",
    name: "Canasta de cuidados",
    description: "Imagen, nombre y datos de ejemplo para reemplazar posteriormente.",
    imageUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=900&q=85",
    totalQuantity: 1,
    availableQuantity: 0,
  },
];

export default function GiftList() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="section-shell section-light" aria-labelledby="gifts-title">
      <motion.div
        className="content-container section-space gifts-content"
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.7, ease: "easeOut" }}
      >
        <div className="text-center">
          <p className="eyebrow">Un detalle para Giovanni</p>
          <h2 id="gifts-title" className="section-title">Regalos</h2>
        </div>
        <div className="gift-list mt-10">
          {mockGifts.map((gift) => (
            <GiftCard gift={gift} key={gift.id} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}