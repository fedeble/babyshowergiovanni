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
            <h2 id="baby-title" className="section-title font-section-title">{invitationConfig.baby.title}</h2>
            <div className="baby-ornament" aria-hidden="true">
              <span />
              <i />
              <span />
            </div>
            <p>{invitationConfig.baby.introduction}</p>
            <p>{invitationConfig.baby.closing}</p>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element -- Image is displayed at its original aspect ratio from the configured public Storage URL. */}
          <img
            className="baby-photo"
            src={invitationConfig.baby.imageUrl}
            alt="Fotografía de Giovanni"
          />
        </div>
      </motion.div>
    </section>
  );
}