"use client";

import { motion, useReducedMotion } from "framer-motion";

const parents = [
  {
    name: "Nombre de mamá (placeholder)",
    imageClass: "parent-photo-mom",
  },
  {
    name: "Nombre de papá (placeholder)",
    imageClass: "parent-photo-dad",
  },
];

export default function Parents() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="section-shell section-light" aria-labelledby="parents-title">
      <motion.div
        className="content-container section-space parents-content"
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.7, ease: "easeOut" }}
      >
        <div className="text-center">
          <p className="eyebrow">Con mucho amor</p>
          <h2 id="parents-title" className="section-title">Sus padres</h2>
        </div>

        <div className="parents-grid mt-10">
          {parents.map((parent) => (
            <article className="parent-card" key={parent.imageClass}>
              <div
                className={`parent-photo ${parent.imageClass}`}
                role="img"
                aria-label={`Fotografía de ${parent.name}`}
              />
              <h3 className="parent-name">{parent.name}</h3>
              <p className="parent-description">Texto de presentación provisional.</p>
            </article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}