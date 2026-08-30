import { useEffect, useState } from "react";
import EventSection from "../components/EventSection";
import api from "../lib/api";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/events")
      .then((res) => setEvents(res.data.events))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-20">
      <div className="section-pad pt-20 pb-6 text-center">
        <h1 className="font-display text-3xl md:text-4xl text-mist">ALL EVENTS</h1>
      </div>
      <EventSection events={events} loading={loading} />
    </div>
  );
}
