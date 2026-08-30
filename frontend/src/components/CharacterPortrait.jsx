import { useMemo, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { CHARACTERS } from "../data/characters";

// One distinct entrance per character personality — mirrors the "six
// different entrance styles" requirement from the original 3D spec, just
// expressed as motion variants instead of a rigged animation.
const ENTRANCE_VARIANTS = {
  "confident-heroic": {
    initial: { opacity: 0, y: 50, scale: 0.92 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
  "heavy-powerful": {
    initial: { opacity: 0, y: -70 },
    whileInView: { opacity: 1, y: [-70, 10, 0] },
    transition: { duration: 1.1, ease: "easeOut" },
  },
  "precise-intelligent": {
    initial: { opacity: 0, x: -36, filter: "blur(8px)" },
    whileInView: { opacity: 1, x: 0, filter: "blur(0px)" },
    transition: { duration: 0.85, ease: "easeOut" },
  },
  "fast-aggressive": {
    initial: { opacity: 0, x: -90, rotate: -5 },
    whileInView: { opacity: 1, x: 0, rotate: 0 },
    transition: { duration: 0.55, ease: "easeOut" },
  },
  "dynamic-fast": {
    initial: { opacity: 0, rotate: 18, scale: 0.7 },
    whileInView: { opacity: 1, rotate: 0, scale: 1 },
    transition: { duration: 0.65, ease: "easeOut" },
  },
  "energetic-friendly": {
    initial: { opacity: 0, y: 24, scale: 0.6 },
    whileInView: { opacity: 1, y: 0, scale: [0.6, 1.08, 1] },
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const IDLE_BY_PERSONALITY = {
  heroic: { y: [0, -8, 0], duration: 4.2 },
  aggressive: { y: [0, -5, 0], duration: 3 },
  precise: { y: [0, -6, 0], duration: 4.6 },
  powerful: { y: [0, -4, 0], duration: 5.2 },
  dynamic: { y: [0, -7, 0], duration: 3.4 },
  friendly: { y: [0, -9, 0], duration: 3.6 },
};

/**
 * CharacterPortrait — the assigned character's animated portrait.
 * `size`: "card" (event cards / lineup), "details" (large hero panels with
 * mouse-parallax tilt), "hero" (homepage cinematic hero, no tilt).
 */
export default function CharacterPortrait({ characterId, size = "card", className = "" }) {
  const cfg = CHARACTERS[characterId];
  const containerRef = useRef(null);
  const enableTilt = size === "details";

  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const springX = useSpring(rotX, { stiffness: 120, damping: 14 });
  const springY = useSpring(rotY, { stiffness: 120, damping: 14 });

  // Ambient motes drifting around the character, colored to match their core.
  const particles = useMemo(
    () =>
      Array.from({ length: size === "details" ? 16 : 10 }, () => ({
        left: 10 + Math.random() * 80,
        top: 10 + Math.random() * 80,
        size: Math.random() * 2.4 + 1.2,
        delay: Math.random() * 5,
        duration: Math.random() * 4 + 4,
      })),
    [characterId, size]
  );

  function handleMouseMove(e) {
    if (!enableTilt || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotY.set(px * 16);
    rotX.set(py * -16);
  }
  function handleMouseLeave() {
    rotX.set(0);
    rotY.set(0);
  }

  const variant = ENTRANCE_VARIANTS[cfg.entrance] || ENTRANCE_VARIANTS["confident-heroic"];
  const idle = IDLE_BY_PERSONALITY[cfg.personality] || IDLE_BY_PERSONALITY.heroic;

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover="hover"
      initial="rest"
      className={`relative flex items-center justify-center h-full w-full ${className}`}
      style={{ perspective: 900 }}
    >
      {/* pulsing energy glow behind the character — intensifies on hover */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "60%",
          height: "60%",
          background: `radial-gradient(circle, ${cfg.coreColor}55 0%, transparent 70%)`,
          filter: "blur(20px)",
        }}
        animate={{ opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        variants={{ rest: { scale: 1 }, hover: { scale: 1.25 } }}
      />

      {/* ambient particle motes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((pt, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${pt.left}%`,
              top: `${pt.top}%`,
              width: pt.size,
              height: pt.size,
              backgroundColor: cfg.coreColor,
              animation: `airoFloat ${pt.duration}s ease-in-out ${pt.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <motion.div
        style={enableTilt ? { rotateX: springX, rotateY: springY, transformStyle: "preserve-3d" } : undefined}
        initial={variant.initial}
        whileInView={variant.whileInView}
        viewport={{ once: true, amount: 0.35 }}
        transition={variant.transition}
        variants={{ hover: { scale: 1.03 } }}
        className="relative h-full flex items-end justify-center"
      >
        <motion.img
          src={cfg.image}
          alt={cfg.label}
          draggable={false}
          className="h-full w-auto max-h-full object-contain select-none"
          style={{ filter: `drop-shadow(0 0 24px ${cfg.coreColor}55)` }}
          animate={{ y: idle.y }}
          transition={{ duration: idle.duration, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* energy scan-line sweeping across the character */}
        <motion.div
          className="absolute inset-x-0 pointer-events-none"
          style={{
            height: "18%",
            background: `linear-gradient(to bottom, transparent, ${cfg.coreColor}33, transparent)`,
            mixBlendMode: "screen",
          }}
          animate={{ top: ["0%", "82%", "0%"] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}
        />
      </motion.div>
    </motion.div>
  );
}
