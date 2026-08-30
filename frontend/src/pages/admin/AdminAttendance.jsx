import { useEffect, useState } from "react";
import { Download, Search } from "lucide-react";
import api from "../../lib/api";
import { CHARACTERS } from "../../data/characters";

export default function AdminAttendance() {
  const [records, setRecords] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventFilter, setEventFilter] = useState("");
  const [date, setDate] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/events").then((res) => setEvents(res.data.events));
  }, []);

  function load() {
    setLoading(true);
    const params = {};
    if (eventFilter) params.event = eventFilter;
    if (date) params.date = date;
    if (query) params.q = query;
    api
      .get("/admin/attendance", { params })
      .then((res) => setRecords(res.data.attendance))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventFilter, date, query]);

  function exportCsv() {
    window.open("/api/admin/attendance-export.csv", "_blank");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="font-display text-2xl text-mist">ATTENDANCE</h1>
        <button onClick={exportCsv} className="flex items-center gap-2 text-xs tracking-widest2 text-cyan-400 border border-cyan-400/40 px-4 py-2 hover:bg-cyan-400/10">
          <Download size={14} /> EXPORT CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2 bg-gunmetal border border-steel px-3 py-2 flex-1 min-w-[200px]">
          <Search size={14} className="text-mist/40" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search participant…" className="bg-transparent outline-none text-mist w-full text-sm" />
        </div>
        <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} className="bg-gunmetal border border-steel px-4 py-2 text-mist text-sm">
          <option value="">All events</option>
          {events.map((ev) => <option key={ev.slug} value={ev.slug}>{ev.name}</option>)}
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-gunmetal border border-steel px-4 py-2 text-mist text-sm" />
      </div>

      {loading ? (
        <p className="text-mist/50">Loading…</p>
      ) : (
        <div className="overflow-x-auto glass-panel">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-mist/40 text-xs tracking-widest2 border-b border-steel/40">
                <th className="p-4">Participant</th>
                <th className="p-4">Event</th>
                <th className="p-4">Date</th>
                <th className="p-4">Check-in time</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => {
                const cfg = CHARACTERS[r.eventId.assignedCharacter];
                return (
                  <tr key={r._id} className="border-b border-steel/20">
                    <td className="p-4 text-mist">{r.participantId.fullName}</td>
                    <td className="p-4" style={{ color: cfg.coreColor }}>{r.eventId.name}</td>
                    <td className="p-4 text-mist/60">{r.checkInDate}</td>
                    <td className="p-4 text-mist/60">{r.checkInTime}</td>
                  </tr>
                );
              })}
              {records.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-mist/40">No attendance records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
