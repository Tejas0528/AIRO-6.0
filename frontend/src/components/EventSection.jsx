import EventCard from "./EventCard";

export default function EventSection({ events, loading }) {
  return (
    <section id="events" className="section-pad py-28 bg-charcoal relative">
      <div className="text-center mb-16">
        <p className="text-xs tracking-widest2 text-cyan-400 mb-3">SIX CHALLENGES. SIX TRANSFORMERS. ONE DESTINATION.</p>
        <h2 className="font-display text-4xl md:text-5xl text-mist">OUR EVENTS</h2>
      </div>

      {loading ? (
        <div className="text-center text-mist/50 py-20">Loading events…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {events.map((event, i) => (
            <EventCard key={event._id || event.slug} event={event} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
