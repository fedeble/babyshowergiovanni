"use client";

import { motion, useReducedMotion } from "framer-motion";
import { invitationConfig } from "@/lib/invitation-config";

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = reduceMotion === false;
  const transition = shouldAnimate
    ? { duration: 0.8, ease: "easeOut" as const }
    : { duration: 0.8, ease: "easeOut" as const };

  return (
    <section
      className="hero-section section-shell"
      aria-labelledby="hero-title"
      style={{ backgroundImage: `url(${invitationConfig.coverImage})` }}
    >
      <div className="hero-wash" aria-hidden="true" />
      <motion.div
        className="hero-decoration hero-decoration-left"
        aria-hidden="true"
        initial={shouldAnimate ? { opacity: 0, rotate: -12, y: 10 } : false}
        animate={shouldAnimate ? { opacity: 1, rotate: [0, 2, 0], y: [0, -4, 0] } : undefined}
        transition={shouldAnimate ? { ...transition, delay: 0.5, rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } } : transition}
      />
      <motion.div
        className="hero-decoration hero-decoration-right"
        aria-hidden="true"
        initial={shouldAnimate ? { opacity: 0, rotate: 12, y: -10 } : false}
        animate={shouldAnimate ? { opacity: 1, rotate: [0, -2, 0], y: [0, 4, 0] } : undefined}
        transition={shouldAnimate ? { ...transition, delay: 0.7, rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } } : transition}
      />
      <motion.div
        className="content-container hero-content"
        initial={shouldAnimate ? { opacity: 0, y: 18 } : false}
        animate={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
        transition={transition}
      >
        <p className="eyebrow hero-eyebrow">{invitationConfig.title}</p>
        <h1 id="hero-title" className="display-title mt-5">{invitationConfig.babyName}</h1>
        <p className="hero-welcome">{invitationConfig.welcomeText}</p>
        <div className="ornament mt-7" aria-hidden="true" />
      </motion.div>
      <motion.div
        className="hero-scroll"
        aria-hidden="true"
        initial={shouldAnimate ? { opacity: 0 } : false}
        animate={shouldAnimate ? { opacity: 1 } : undefined}
        transition={shouldAnimate ? { ...transition, delay: 1 } : transition}
      >
        <span>Scroll</span>
        <motion.span
          className="hero-scroll-line"
          animate={shouldAnimate ? { y: [0, 7, 0] } : undefined}
          transition={shouldAnimate ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" } : transition}
        />
      </motion.div>
    </section>
  );
}