import { useEffect, useState } from "react";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import api from "../lib/api";
import { CHARACTERS } from "../data/characters";

export default function Schedule() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get("/events").then((res) => setEvents(res.data.events));
  }, []);

  return (
    <div className="pt-32 pb-24 section-pad max-w-4xl mx-auto">
      <h1 className="font-display text-3xl md:text-4xl text-mist mb-3">SCHEDULE</h1>
      <p className="text-mist/50 text-sm mb-12">
        Dates, times and venues below are set by the AIRO 6.0 organizing team and may be updated.
      </p>

      <div className="space-y-4">
        {events.map((ev) => {
          const cfg = CHARACTERS[ev.assignedCharacter];
          return (
            <div key={ev.slug} className="glass-panel p-6 flex flex-col md:flex-row md:items-center gap-4 border-l-2" style={{ borderColor: cfg.coreColor }}>
              <div className="flex-1">
                <p className="text-xs tracking-widest2" style={{ color: cfg.coreColor }}>{cfg.label}</p>
                <h3 className="font-display text-lg text-mist">{ev.name}</h3>
              </div>
              <div className="flex flex-wrap gap-5 text-sm text-mist/60">
                <span className="flex items-center gap-2"><CalendarDays size={14} /> {ev.date || "TBA"}</span>
                <span className="flex items-center gap-2"><Clock size={14} /> {ev.time || "TBA"}</span>
                <span className="flex items-center gap-2"><MapPin size={14} /> {ev.venue || "TBA"}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
