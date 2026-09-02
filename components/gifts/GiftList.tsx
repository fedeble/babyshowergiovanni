"use client";

import { motion, useReducedMotion } from "framer-motion";
import GiftCard from "./GiftCard";
import { invitationConfig } from "@/lib/invitation-config";

export default function GiftList() {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = reduceMotion === false;

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
          {invitationConfig.gifts.items.map((gift) => (
            <GiftCard gift={gift} key={gift.id} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}