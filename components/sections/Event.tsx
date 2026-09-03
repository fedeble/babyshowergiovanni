"use client";

import { motion, useReducedMotion } from "framer-motion";
import Map, { type MapLocation } from "./Map";
import { invitationConfig } from "@/lib/invitation-config";
import type { EventData } from "@/lib/supabase/invitation-data";

type EventProps = {
  data?: EventData;
};

export default function Event({ data }: EventProps) {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = reduceMotion === false;
  const eventDetails = data?.details ?? invitationConfig.event.details;
  const eventLocation: MapLocation = data?.location ?? invitationConfig.event.location;
  const directionsUrl = eventLocation.latitude !== null && eventLocation.longitude !== null
    ? `https://www.google.com/maps/dir/?api=1&destination=${eventLocation.latitude},${eventLocation.longitude}`
    : undefined;

  return (
    <section className="section-shell section-sage" aria-labelledby="event-title">
      <motion.div
        className="content-container section-space event-content"
        initial={shouldAnimate ? { opacity: 0, y: 28 } : false}
        whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
        viewport={{ once: true, amount: 0.2 }}
        transition={shouldAnimate ? { duration: 0.7, ease: "easeOut" } : { duration: 0 }}
      >
        <div className="text-center">
          <p className="eyebrow">{invitationConfig.event.sectionLabel}</p>
          <h2 id="event-title" className="section-title">{invitationConfig.event.title}</h2>
        </div>

        <div className="event-panel mt-10">
          <dl className="event-details">
            {eventDetails.map((detail) => (
              <div className="event-detail" key={detail.label}>
                <dt>
                  <span className={`event-detail-icon event-detail-icon-${detail.icon}`} aria-hidden="true" />
                  {detail.label}
                </dt>
                <dd>{detail.value ?? "A confirmar"}</dd>
              </div>
            ))}
          </dl>
          <Map location={eventLocation} />
          <a
            className={`directions-button${directionsUrl ? "" : " directions-button-disabled"}`}
            href={directionsUrl}
            target={directionsUrl ? "_blank" : undefined}
            rel={directionsUrl ? "noreferrer" : undefined}
            aria-label={`${invitationConfig.event.directionsLabel} a ${eventLocation.label}`}
            aria-disabled={directionsUrl ? undefined : true}
          >
            {invitationConfig.event.directionsLabel}
          </a>
        </div>
      </motion.div>
    </section>
  );
}