"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.8, ease: "easeOut" as const };

  return (
    <section className="hero-section section-shell" aria-labelledby="hero-title">
      <div className="hero-wash" aria-hidden="true" />
      <motion.div
        className="hero-decoration hero-decoration-left"
        aria-hidden="true"
        initial={reduceMotion ? false : { opacity: 0, rotate: -12, y: 10 }}
        animate={reduceMotion ? undefined : { opacity: 1, rotate: [0, 2, 0], y: [0, -4, 0] }}
        transition={reduceMotion ? transition : { ...transition, delay: 0.5, rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
      />
      <motion.div
        className="hero-decoration hero-decoration-right"
        aria-hidden="true"
        initial={reduceMotion ? false : { opacity: 0, rotate: 12, y: -10 }}
        animate={reduceMotion ? undefined : { opacity: 1, rotate: [0, -2, 0], y: [0, 4, 0] }}
        transition={reduceMotion ? transition : { ...transition, delay: 0.7, rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
      />
      <motion.div
        className="content-container hero-content"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={transition}
      >
        <p className="eyebrow hero-eyebrow">Baby Shower</p>
        <h1 id="hero-title" className="display-title mt-5">Giovanni</h1>
        <div className="ornament mt-7" aria-hidden="true" />
      </motion.div>
    </section>
  );
}