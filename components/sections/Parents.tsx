"use client";

import { motion, useReducedMotion } from "framer-motion";
import { invitationConfig } from "@/lib/invitation-config";

export default function Parents() {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = reduceMotion === false;

  return (
    <section className="section-shell section-light" aria-labelledby="parents-title">
      <motion.div
        className="content-container section-space parents-content"
        initial={shouldAnimate ? { opacity: 0, y: 28 } : false}
        whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
        viewport={{ once: true, amount: 0.2 }}
        transition={shouldAnimate ? { duration: 0.7, ease: "easeOut" } : { duration: 0 }}
      >
        <div className="parents-layout">
          <div className="parents-photo-wrap">
            <div
              className="parents-photo"
              role="img"
              aria-label="Fotografía de Jesús y Celeste"
              style={{ backgroundImage: `url(${invitationConfig.parents.imageUrl})` }}
            />
            <span className="parents-tape" aria-hidden="true" />
            <span className="parents-sprig" aria-hidden="true" />
            <span className="parents-heart" aria-hidden="true" />
          </div>

          <div className="parents-copy">
            <h2 id="parents-title" className="section-title">{invitationConfig.parents.title}</h2>
            <div className="parents-ornament" aria-hidden="true">
              <span />
              <i />
              <span />
            </div>
            <p>{invitationConfig.parents.introduction}</p>
            <p>{invitationConfig.parents.closing}</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}