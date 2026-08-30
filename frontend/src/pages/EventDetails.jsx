import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, Users, IndianRupee, MapPin, CalendarDays, Phone, Mail } from "lucide-react";
import CharacterPortrait from "../components/CharacterPortrait";
import { CHARACTERS } from "../data/characters";
import api, { extractErrorMessage } from "../lib/api";

function InfoList({ title, items }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-8">
      <h4 className="text-xs tracking-widest2 text-mist/50 mb-3">{title}</h4>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-mist/75 flex gap-2">
            <span className="text-cyan-400">—</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function EventDetails() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/events/${eventId}`)
      .then((res) => setEvent(res.data.event))
      .catch((err) => setError(extractErrorMessage(err, "This event could not be found.")))
      .finally(() => setLoading(false));
  }, [eventId]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-mist/50">Loading event…</div>;
  }

  if (error || !event) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
        <p className="text-mist/70">{error || "Event not found."}</p>
        <Link to="/events" className="text-cyan-400 text-sm tracking-widest2">← BACK TO EVENTS</Link>
      </div>
    );
  }

  const cfg = CHARACTERS[event.assignedCharacter];
  const teamLabel = event.teamMin === event.teamMax ? `${event.teamMin}` : `${event.teamMin}-${event.teamMax}`;

  return (
    <div className="pt-20">
      {/* cinematic character stage */}
      <section className="relative h-[70vh] w-full overflow-hidden" style={{ background: `radial-gradient(circle at 50% 30%, ${cfg.palette.accent}33, #050607 70%)` }}>
        <CharacterPortrait characterId={event.assignedCharacter} size="details" />
        <div className="absolute top-8 left-0 right-0 text-center pointer-events-none">
          <p className="text-xs tracking-widest2" style={{ color: cfg.coreColor }}>{cfg.label}</p>
          <h1 className="font-display text-3xl md:text-5xl text-mist mt-2">{event.name}</h1>
        </div>
        <div className="absolute bottom-6 left-0 right-0 text-center text-mist/40 text-xs tracking-widest2 pointer-events-none">
          MOVE TO EXPLORE
        </div>
      </section>

      {/* details */}
      <section className="section-pad py-16 max-w-5xl mx-auto">
        <div className="flex flex-wrap gap-6 mb-10 text-sm text-mist/70">
          {event.hasFixedDuration && event.duration && (
            <span className="flex items-center gap-2"><Clock size={16} /> {event.duration}</span>
          )}
          <span className="flex items-center gap-2"><Users size={16} /> Team of {teamLabel}</span>
          {event.fee > 0 && <span className="flex items-center gap-2"><IndianRupee size={16} /> {event.fee}</span>}
          {event.date && <span className="flex items-center gap-2"><CalendarDays size={16} /> {event.date}</span>}
          {event.venue && <span className="flex items-center gap-2"><MapPin size={16} /> {event.venue}</span>}
        </div>

        <p className="text-mist/80 leading-relaxed mb-10">{event.description}</p>

        {event.rounds && event.rounds.length > 0 && (
          <div className="mb-10 grid gap-3">
            {event.rounds.map((r) => (
              <div key={r} className="glass-panel px-5 py-4 text-sm tracking-wide text-mist/80">{r}</div>
            ))}
          </div>
        )}

        <InfoList title="RULES" items={event.rules} />
        <InfoList title="GUIDELINES" items={event.guidelines} />
        <InfoList title="ELIGIBILITY" items={event.eligibility} />
        <InfoList title="PRIZES" items={event.prizes} />

        {(event.coordinator?.name || event.coordinator?.phone || event.coordinator?.email) && (
          <div className="mb-10">
            <h4 className="text-xs tracking-widest2 text-mist/50 mb-3">COORDINATOR</h4>
            <div className="flex flex-wrap gap-6 text-sm text-mist/75">
              {event.coordinator.name && <span>{event.coordinator.name}</span>}
              {event.coordinator.phone && <span className="flex items-center gap-2"><Phone size={14} />{event.coordinator.phone}</span>}
              {event.coordinator.email && <span className="flex items-center gap-2"><Mail size={14} />{event.coordinator.email}</span>}
            </div>
          </div>
        )}

        <Link
          to={`/register?event=${event.slug}`}
          className="inline-block px-10 py-4 text-xs tracking-widest2"
          style={{ backgroundColor: cfg.coreColor, color: "#050607" }}
        >
          REGISTER NOW
        </Link>
      </section>
    </div>
  );
}
