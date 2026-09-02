"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function Footer() {
  const reduceMotion = useReducedMotion();

  return (
    <footer className="section-shell footer-section" aria-labelledby="footer-title">
      <motion.div
        className="content-container footer-content"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.7, ease: "easeOut" }}
      >
        <div className="footer-ornament" aria-hidden="true">
          <span />
          <span className="footer-ornament-center" />
          <span />
        </div>
        <p id="footer-title" className="display-copy">Gracias por acompañarnos</p>
        <p className="footer-name">Giovanni</p>
      </motion.div>
    </footer>
  );
}