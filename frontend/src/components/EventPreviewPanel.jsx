import { Clock, Users, IndianRupee, Radio } from "lucide-react";
import EventRobotScene from "./EventRobotScene";
import { CHARACTERS } from "../data/characters";

/**
 * EventPreviewPanel — a large, cinematic "assigned character" card.
 * Used on the Register page so the robot animation shows up there too,
 * not just on the event card / event details page.
 */
export default function EventPreviewPanel({ event }) {
  if (!event) return null;
  const cfg = CHARACTERS[event.assignedCharacter];
  const teamLabel = event.teamMin === event.teamMax ? `${event.teamMin}` : `${event.teamMin}-${event.teamMax}`;

  return (
    <div
      className="glass-panel overflow-hidden border-t-2 sticky top-24"
      style={{ borderColor: cfg.coreColor }}
    >
      <div
        className="relative h-72"
        style={{ background: `radial-gradient(circle at 50% 35%, ${cfg.palette.accent}66, #050607 75%)` }}
      >
        <EventRobotScene characterId={event.assignedCharacter} height={288} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-charcoal via-charcoal/70 to-transparent">
          <p className="text-xs tracking-widest2" style={{ color: cfg.coreColor }}>ASSIGNED TRANSFORMER</p>
          <h3 className="font-display text-2xl tracking-widest2 text-mist text-glow" style={{ color: cfg.coreColor }}>
            {cfg.label}
          </h3>
        </div>
      </div>

      <div className="p-6">
        <p className="text-xs tracking-widest2 text-mist/40 mb-1">{event.category}</p>
        <h4 className="font-display text-lg text-mist mb-4">{event.name}</h4>
        <p className="text-sm text-mist/60 mb-6 leading-relaxed">{event.description}</p>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <Stat icon={Users} label="TEAM SIZE" value={`${teamLabel} MEMBERS`} color={cfg.coreColor} />
          {event.hasFixedDuration && event.duration ? (
            <Stat icon={Clock} label="DURATION" value={event.duration} color={cfg.coreColor} />
          ) : (
            <Stat icon={Clock} label="DURATION" value="EXTENDED SESSION" color={cfg.coreColor} />
          )}
          <Stat
            icon={IndianRupee}
            label="ENTRY FEE"
            value={event.fee > 0 ? `₹${event.fee} / TEAM` : "FREE"}
            color={cfg.coreColor}
          />
          <Stat icon={Radio} label="MODE" value="ONSITE" color={cfg.coreColor} />
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, color }) {
  return (
    <div className="border border-steel/40 bg-gunmetal/50 p-3">
      <div className="flex items-center gap-2 mb-1" style={{ color }}>
        <Icon size={14} />
        <span className="tracking-widest2 text-[10px]">{label}</span>
      </div>
      <p className="text-mist/85">{value}</p>
    </div>
  );
}
