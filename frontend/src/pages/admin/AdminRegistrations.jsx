import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Search, Trash2, Download } from "lucide-react";
import api, { extractErrorMessage } from "../../lib/api";
import { CHARACTERS } from "../../data/characters";

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventFilter, setEventFilter] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    const params = {};
    if (eventFilter) params.event = eventFilter;
    if (query) params.q = query;
    api
      .get("/admin/registrations", { params })
      .then((res) => setRegistrations(res.data.registrations))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    api.get("/admin/events").then((res) => setEvents(res.data.events));
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventFilter, query]);

  async function handleDelete(id) {
    if (!confirm("Delete this registration? This also removes any attendance record for it.")) return;
    try {
      await api.delete(`/admin/registrations/${id}`);
      toast.success("Registration deleted.");
      setSelected(null);
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Could not delete registration."));
    }
  }

  function exportCsv() {
    window.open("/api/admin/registrations-export.csv", "_blank");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="font-display text-2xl text-mist">REGISTRATIONS</h1>
        <button onClick={exportCsv} className="flex items-center gap-2 text-xs tracking-widest2 text-cyan-400 border border-cyan-400/40 px-4 py-2 hover:bg-cyan-400/10">
          <Download size={14} /> EXPORT CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2 bg-gunmetal border border-steel px-3 py-2 flex-1 min-w-[220px]">
          <Search size={14} className="text-mist/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, ID, team…"
            className="bg-transparent outline-none text-mist w-full text-sm"
          />
        </div>
        <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} className="bg-gunmetal border border-steel px-4 py-2 text-mist text-sm">
          <option value="">All events</option>
          {events.map((ev) => <option key={ev.slug} value={ev.slug}>{ev.name}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-mist/50">Loading…</p>
      ) : (
        <div className="overflow-x-auto glass-panel">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-mist/40 text-xs tracking-widest2 border-b border-steel/40">
                <th className="p-4">Registration ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Event</th>
                <th className="p-4">Team</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r) => {
                const cfg = CHARACTERS[r.event.assignedCharacter];
                return (
                  <tr key={r._id} className="border-b border-steel/20 hover:bg-gunmetal/50 cursor-pointer" onClick={() => setSelected(r)}>
                    <td className="p-4 text-mist/80">{r.registrationId}</td>
                    <td className="p-4 text-mist">{r.participant.fullName}</td>
                    <td className="p-4" style={{ color: cfg.coreColor }}>{r.event.name}</td>
                    <td className="p-4 text-mist/60">{r.teamName}</td>
                    <td className="p-4">
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(r._id); }} className="text-mist/30 hover:text-red-400">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {registrations.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-mist/40">No registrations found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50" onClick={() => setSelected(null)}>
          <div className="glass-panel bg-charcoal p-8 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-lg text-mist mb-4">{selected.registrationId}</h2>
            <dl className="space-y-2 text-sm">
              <Row label="Name" value={selected.participant.fullName} />
              <Row label="Email" value={selected.participant.email} />
              <Row label="Phone" value={selected.participant.phone} />
              <Row label="College" value={selected.participant.collegeName} />
              <Row label="Department" value={selected.participant.department} />
              <Row label="Register No." value={selected.participant.registerNumber} />
              <Row label="Event" value={selected.event.name} />
              <Row label="Team" value={selected.teamName} />
              <Row label="Members" value={selected.teamMembers.join(", ") || "—"} />
            </dl>
            <div className="flex justify-end gap-3 mt-6">
              <a href={`/ticket/${selected._id}`} target="_blank" rel="noreferrer" className="text-xs tracking-widest2 text-cyan-400 border border-cyan-400/40 px-4 py-2 hover:bg-cyan-400/10">
                VIEW TICKET
              </a>
              <button onClick={() => setSelected(null)} className="text-xs tracking-widest2 text-mist/60 border border-steel px-4 py-2">CLOSE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b border-steel/20 pb-2">
      <dt className="text-mist/40">{label}</dt>
      <dd className="text-mist/90">{value}</dd>
    </div>
  );
}
