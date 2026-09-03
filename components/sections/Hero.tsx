"use client";

import { motion, useReducedMotion } from "framer-motion";
import { invitationConfig } from "@/lib/invitation-config";

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = reduceMotion === false;
  const transition = { duration: 0.8, ease: "easeOut" as const };

  return (
    <section
      className="hero-section section-shell"
      aria-labelledby="hero-title"
      style={{ backgroundImage: `url(${invitationConfig.coverImage})` }}
    >
      <motion.div
        className="content-container hero-content"
        initial={shouldAnimate ? { opacity: 0, y: 18 } : false}
        animate={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
        transition={transition}
      >
        <p className="eyebrow hero-eyebrow">{invitationConfig.title}</p>
        <h1 id="hero-title" className="display-title hero-name">{invitationConfig.babyName}</h1>
        <div className="hero-ornament" aria-hidden="true">
          <span />
          <i />
          <span />
        </div>
        <p className="hero-welcome">{invitationConfig.welcomeText}</p>
      </motion.div>
    </section>
  );
}