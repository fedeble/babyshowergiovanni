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
        <div className="text-center">
          <p className="eyebrow">{invitationConfig.parentsSectionLabel}</p>
          <h2 id="parents-title" className="section-title">Sus padres</h2>
        </div>

        <div className="parents-grid mt-10">
          {invitationConfig.parents.map((parent) => (
            <article className="parent-card" key={parent.role}>
              <div
                className={`parent-photo ${parent.imageClass}`}
                role="img"
                aria-label={`Fotografía de ${parent.name ?? parent.role}`}
                style={{ backgroundImage: `url(${parent.imageUrl})` }}
              />
              <h3 className="parent-name">{parent.name ?? parent.role}</h3>
              {parent.description && <p className="parent-description">{parent.description}</p>}
            </article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}