"use client";

import { motion, useReducedMotion } from "framer-motion";
import { invitationConfig } from "@/lib/invitation-config";

export default function Baby() {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = reduceMotion === false;

  return (
    <section className="section-shell section-light" aria-labelledby="baby-title">
      <motion.div
        className="content-container section-space baby-content"
        initial={shouldAnimate ? { opacity: 0, y: 28 } : false}
        whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
        viewport={{ once: true, amount: 0.2 }}
        transition={shouldAnimate ? { duration: 0.7, ease: "easeOut" } : { duration: 0 }}
      >
        <div className="baby-layout">
          <div className="baby-copy">
            <h2 id="baby-title" className="section-title">{invitationConfig.baby.title}</h2>
            <div className="baby-ornament" aria-hidden="true">
              <span />
              <i />
              <span />
            </div>
            <p>{invitationConfig.baby.introduction}</p>
            <p>{invitationConfig.baby.closing}</p>
          </div>

          <div className="baby-photo-wrap">
            <div
              className="baby-photo"
              role="img"
              aria-label="Fotografía de Giovanni"
              style={{ backgroundImage: `url(${invitationConfig.baby.imageUrl})` }}
            />
            <span className="baby-tape" aria-hidden="true" />
            <span className="baby-sprig" aria-hidden="true" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}