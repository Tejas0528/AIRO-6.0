import { Link } from "react-router-dom";
import { Users, Clock, IndianRupee } from "lucide-react";
import EventRobotScene from "./EventRobotScene";
import { CHARACTERS } from "../data/characters";

export default function EventCard({ event, index }) {
  const cfg = CHARACTERS[event.assignedCharacter];
  const teamLabel = event.teamMin === event.teamMax ? `${event.teamMin}` : `${event.teamMin}-${event.teamMax}`;

  return (
    <div className="glass-panel relative overflow-hidden group border-t-2" style={{ borderColor: cfg.coreColor }}>
      <div className="absolute top-4 left-4 z-20 font-display text-xs tracking-widest2 text-mist/50">
        0{index + 1}
      </div>

      {/* Robot stage — dominates the top of the card, name overlaid in a gradient
          like a character-select panel rather than a small badge. */}
      <div
        className="relative"
        style={{ background: `radial-gradient(circle at 50% 30%, ${cfg.palette.accent}55, #050607 80%)` }}
      >
        <EventRobotScene characterId={event.assignedCharacter} height={320} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent">
          <p className="font-display text-xl tracking-widest2 text-glow" style={{ color: cfg.coreColor }}>
            {cfg.label}
          </p>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-display text-lg tracking-wide text-mist mb-1">{event.name}</h3>
        <p className="text-xs uppercase tracking-widest2 text-mist/40 mb-4">{event.category}</p>

        <p className="text-sm text-mist/70 leading-relaxed mb-5 line-clamp-3">{event.description}</p>

        <div className="flex flex-wrap gap-4 mb-6 text-xs text-mist/60">
          {event.hasFixedDuration && event.duration && (
            <span className="flex items-center gap-1.5">
              <Clock size={14} /> {event.duration}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Users size={14} /> {teamLabel} MEMBERS
          </span>
          {event.fee > 0 && (
            <span className="flex items-center gap-1.5">
              <IndianRupee size={14} /> {event.fee}
            </span>
          )}
        </div>

        <div className="flex gap-3">
          <Link
            to={`/events/${event.slug}`}
            className="flex-1 text-center border border-mist/20 text-mist/90 text-xs tracking-widest2 py-3 hover:border-mist/50 transition-colors"
          >
            VIEW DETAILS
          </Link>
          <Link
            to={`/register?event=${event.slug}`}
            className="flex-1 text-center text-xs tracking-widest2 py-3 transition-opacity hover:opacity-90"
            style={{ backgroundColor: cfg.coreColor, color: "#050607" }}
          >
            REGISTER NOW
          </Link>
        </div>
      </div>
    </div>
  );
}
