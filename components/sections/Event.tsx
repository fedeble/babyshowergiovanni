"use client";

import { motion, useReducedMotion } from "framer-motion";
import Map, { type MapLocation } from "./Map";

const eventLocation: MapLocation = {
  latitude: 0,
  longitude: 0,
  label: "Ubicación por definir (placeholder)",
};

const eventDetails = [
  { label: "Fecha", value: "Fecha por definir (placeholder)" },
  { label: "Hora", value: "Hora por definir (placeholder)" },
  { label: "Lugar", value: "Lugar por definir (placeholder)" },
  { label: "Dirección", value: "Dirección por definir (placeholder)" },
];

export default function Event() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="section-shell section-sage" aria-labelledby="event-title">
      <motion.div
        className="content-container section-space event-content"
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.7, ease: "easeOut" }}
      >
        <div className="text-center">
          <p className="eyebrow">Un día para celebrar</p>
          <h2 id="event-title" className="section-title">El evento</h2>
        </div>

        <div className="event-panel mt-10">
          <dl className="event-details">
            {eventDetails.map((detail) => (
              <div className="event-detail" key={detail.label}>
                <dt>{detail.label}</dt>
                <dd>{detail.value}</dd>
              </div>
            ))}
          </dl>
          <Map location={eventLocation} />
          <a
            className="directions-button"
            href={`https://www.google.com/maps/dir/?api=1&destination=${eventLocation.latitude},${eventLocation.longitude}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Cómo llegar (enlace placeholder)"
          >
            Cómo llegar
          </a>
        </div>
      </motion.div>
    </section>
  );
}