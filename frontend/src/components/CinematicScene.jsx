import { useRef } from "react";
import { motion } from "framer-motion";

const PARTICLE_COUNT = 40;
const TEAM_IMAGE = "/scenes/team-group.png";

/**
 * CinematicScene — static full-screen hero background. Shows the full
 * AIRO 6.0 lineup team shot (edges pre-feathered to blend into the site's
 * #050607 background), filling the viewport with a single gentle fade-in
 * on mount. No scroll-linked transforms — the hero is a normal in-flow
 * section, so one regular scroll/swipe moves straight past it.
 */
export default function CinematicScene() {
  const particlesRef = useRef(
    Array.from({ length: PARTICLE_COUNT }, () => ({
      left: Math.random() * 100,
      top: 20 + Math.random() * 70,
      size: Math.random() * 2.2 + 1,
      delay: Math.random() * 6,
      duration: Math.random() * 6 + 7,
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 38%, #0a1830 0%, #050607 68%)" }}
      />

      {particlesRef.current.map((pt, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-cyan-300/40"
          style={{
            left: `${pt.left}%`,
            top: `${pt.top}%`,
            width: pt.size,
            height: pt.size,
            animation: `airoFloat ${pt.duration}s ease-in-out ${pt.delay}s infinite`,
          }}
        />
      ))}

      <motion.img
        src={TEAM_IMAGE}
        alt="The AIRO 6.0 lineup"
        draggable={false}
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="absolute inset-0 w-full h-full object-cover select-none"
        style={{ objectPosition: "center 30%" }}
      />

      {/* readability scrim so the title/buttons stay legible over the art */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 55%, rgba(5,6,7,0.72) 0%, rgba(5,6,7,0.35) 55%, transparent 75%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
        style={{ background: "linear-gradient(to top, #050607 0%, transparent 100%)" }}
      />
    </div>
  );
}
