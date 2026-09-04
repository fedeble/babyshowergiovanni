"use client";

import { motion, useReducedMotion } from "framer-motion";
import { invitationConfig } from "@/lib/invitation-config";

export default function Footer() {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = reduceMotion === false;

  return (
    <footer className="section-shell footer-section" aria-labelledby="footer-title">
      <motion.div
        className="footer-reservation-note"
        initial={shouldAnimate ? { opacity: 0, y: 18 } : false}
        whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
        viewport={{ once: true, amount: 0.35 }}
        transition={shouldAnimate ? { duration: 0.7, ease: "easeOut" } : { duration: 0 }}
      >
        {invitationConfig.footer.reservationNote}
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </motion.div>
      <motion.div
        className="footer-content"
        initial={shouldAnimate ? { opacity: 0, y: 18 } : false}
        whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
        viewport={{ once: true, amount: 0.35 }}
        transition={shouldAnimate ? { duration: 0.7, ease: "easeOut", delay: 0.1 } : { duration: 0 }}
      >
        {invitationConfig.footer.teddyImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- Decorative image is served from the configured public Storage URL.
          <img className="footer-teddy" src={invitationConfig.footer.teddyImageUrl} alt="" />
        )}
        <p id="footer-title" className="footer-message font-section-title">{invitationConfig.footer.message}</p>
        <span className="footer-heart" aria-hidden="true" />
      </motion.div>
    </footer>
  );
}