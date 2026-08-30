import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CinematicScene from "../components/CinematicScene";
import EventSection from "../components/EventSection";
import api from "../lib/api";
import { siteConfig } from "../data/siteConfig";

const BOOT_LINES = ["INITIALIZING AIRO 6.0...", "SYSTEM ONLINE"];

export default function Home() {
  const [bootStep, setBootStep] = useState(0); // 0: line1, 1: line2, 2: title revealed
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setBootStep(1), 1100);
    const t2 = setTimeout(() => setBootStep(2), 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    api
      .get("/events")
      .then((res) => setEvents(res.data.events))
      .catch(() => setEvents([]))
      .finally(() => setLoadingEvents(false));
  }, []);

  return (
    <div>
      {/* HERO — full-screen, static (no pinned scroll-scrub). One normal
          scroll/swipe moves straight past it into the events section. */}
      <section className="relative h-screen w-full overflow-hidden bg-void">
        <CinematicScene />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <AnimatePresence mode="wait">
            {bootStep < 2 && (
              <motion.p
                key={bootStep}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-display text-sm md:text-base tracking-widest2 text-cyan-400/80"
              >
                {BOOT_LINES[bootStep]}
              </motion.p>
            )}
          </AnimatePresence>

          {bootStep >= 2 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-widest2 text-mist text-glow">
                AIRO 6.0
              </h1>
              <p className="mt-4 text-sm md:text-lg tracking-widest2 text-mist/70">TRANSFORM YOUR IDEAS.</p>

              <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs md:text-sm tracking-widest2 text-mist/50">
                <span>{siteConfig.eventDate}</span>
                <span>•</span>
                <span>{siteConfig.venue}</span>
                <span>•</span>
                <span>{siteConfig.collegeName}</span>
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <a href="#events" className="px-7 py-3 bg-cyan-400 text-void text-xs tracking-widest2 hover:opacity-90 transition-opacity">
                  ENTER AIRO 6.0
                </a>
                <a href="#events" className="px-7 py-3 border border-mist/30 text-mist text-xs tracking-widest2 hover:border-mist/60 transition-colors">
                  EXPLORE EVENTS
                </a>
                <Link to="/register" className="px-7 py-3 border border-cyan-400/50 text-cyan-400 text-xs tracking-widest2 hover:bg-cyan-400/10 transition-colors">
                  REGISTER NOW
                </Link>
              </div>
            </motion.div>
          )}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-mist/40 text-xs tracking-widest2 animate-bounce">
          SCROLL
        </div>
      </section>

      <EventSection events={events} loading={loadingEvents} />
    </div>
  );
}
