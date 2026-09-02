"use client";

import { motion, useReducedMotion } from "framer-motion";
import { invitationConfig } from "@/lib/invitation-config";

export default function Footer() {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = reduceMotion === false;

  return (
    <footer className="section-shell footer-section" aria-labelledby="footer-title">
      <motion.div
        className="content-container footer-content"
        initial={shouldAnimate ? { opacity: 0, y: 18 } : false}
        whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
        viewport={{ once: true, amount: 0.35 }}
        transition={shouldAnimate ? { duration: 0.7, ease: "easeOut" } : { duration: 0 }}
      >
        <div className="footer-ornament" aria-hidden="true">
          <span />
          <span className="footer-ornament-center" />
          <span />
        </div>
        <p id="footer-title" className="display-copy">{invitationConfig.footer.message}</p>
        <p className="footer-name">{invitationConfig.footer.name}</p>
      </motion.div>
    </footer>
  );
}