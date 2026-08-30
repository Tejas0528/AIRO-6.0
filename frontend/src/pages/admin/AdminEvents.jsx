import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api, { extractErrorMessage } from "../../lib/api";
import { CHARACTER_LIST } from "../../data/characters";

const LIST_FIELDS = ["rules", "guidelines", "eligibility", "prizes"];

function toTextarea(arr) {
  return (arr || []).join("\n");
}
function fromTextarea(text) {
  return text.split("\n").map((s) => s.trim()).filter(Boolean);
}

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [editing, setEditing] = useState(null); // event being edited (draft copy)
  const [saving, setSaving] = useState(false);

  function load() {
    api.get("/admin/events").then((res) => setEvents(res.data.events));
  }

  useEffect(load, []);

  function openEdit(ev) {
    setEditing({
      ...ev,
      rulesText: toTextarea(ev.rules),
      guidelinesText: toTextarea(ev.guidelines),
      eligibilityText: toTextarea(ev.eligibility),
      prizesText: toTextarea(ev.prizes),
      coordinator: ev.coordinator || { name: "", phone: "", email: "" },
    });
  }

  async function save() {
    setSaving(true);
    try {
      const payload = {
        name: editing.name,
        description: editing.description,
        duration: editing.hasFixedDuration ? editing.duration : null,
        hasFixedDuration: editing.hasFixedDuration,
        teamMin: Number(editing.teamMin),
        teamMax: Number(editing.teamMax),
        fee: Number(editing.fee) || 0,
        assignedCharacter: editing.assignedCharacter,
        date: editing.date,
        time: editing.time,
        venue: editing.venue,
        coordinator: editing.coordinator,
        rules: fromTextarea(editing.rulesText),
        guidelines: fromTextarea(editing.guidelinesText),
        eligibility: fromTextarea(editing.eligibilityText),
        prizes: fromTextarea(editing.prizesText),
      };
      await api.put(`/admin/events/${editing._id}`, payload);
      toast.success("Event updated.");
      setEditing(null);
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Could not save event."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-mist mb-8">EVENTS</h1>

      <div className="space-y-3 mb-10">
        {events.map((ev) => (
          <div key={ev._id} className="glass-panel p-5 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-mist">{ev.name}</p>
              <p className="text-xs text-mist/40">{ev.assignedCharacter} · Team {ev.teamMin}-{ev.teamMax}{ev.fee ? ` · ₹${ev.fee}` : ""}</p>
            </div>
            <button onClick={() => openEdit(ev)} className="text-xs tracking-widest2 text-cyan-400 border border-cyan-400/40 px-4 py-2 hover:bg-cyan-400/10">
              EDIT
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50 overflow-y-auto">
          <div className="glass-panel bg-charcoal p-8 w-full max-w-2xl my-10 space-y-5">
            <h2 className="font-display text-lg text-mist">EDIT — {editing.name}</h2>

            <TextField label="Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
            <TextAreaField label="Description" value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} />

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2 text-sm text-mist/70 col-span-2">
                <input type="checkbox" checked={editing.hasFixedDuration} onChange={(e) => setEditing({ ...editing, hasFixedDuration: e.target.checked })} />
                Show a fixed duration
              </label>
              {editing.hasFixedDuration && (
                <TextField label="Duration" value={editing.duration || ""} onChange={(v) => setEditing({ ...editing, duration: v })} />
              )}
              <TextField label="Fee (₹, 0 = free)" value={editing.fee} onChange={(v) => setEditing({ ...editing, fee: v })} />
              <TextField label="Team Min" value={editing.teamMin} onChange={(v) => setEditing({ ...editing, teamMin: v })} />
              <TextField label="Team Max" value={editing.teamMax} onChange={(v) => setEditing({ ...editing, teamMax: v })} />
            </div>

            <label className="block">
              <span className="text-xs tracking-widest2 text-mist/50">Assigned Transformer</span>
              <select
                value={editing.assignedCharacter}
                onChange={(e) => setEditing({ ...editing, assignedCharacter: e.target.value })}
                className="mt-2 w-full bg-gunmetal border border-steel px-4 py-3 text-mist"
              >
                {CHARACTER_LIST.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </label>

            <div className="grid grid-cols-3 gap-4">
              <TextField label="Date" value={editing.date || ""} onChange={(v) => setEditing({ ...editing, date: v })} />
              <TextField label="Time" value={editing.time || ""} onChange={(v) => setEditing({ ...editing, time: v })} />
              <TextField label="Venue" value={editing.venue || ""} onChange={(v) => setEditing({ ...editing, venue: v })} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <TextField label="Coordinator name" value={editing.coordinator.name} onChange={(v) => setEditing({ ...editing, coordinator: { ...editing.coordinator, name: v } })} />
              <TextField label="Coordinator phone" value={editing.coordinator.phone} onChange={(v) => setEditing({ ...editing, coordinator: { ...editing.coordinator, phone: v } })} />
              <TextField label="Coordinator email" value={editing.coordinator.email} onChange={(v) => setEditing({ ...editing, coordinator: { ...editing.coordinator, email: v } })} />
            </div>

            <TextAreaField label="Rules (one per line)" value={editing.rulesText} onChange={(v) => setEditing({ ...editing, rulesText: v })} />
            <TextAreaField label="Guidelines (one per line)" value={editing.guidelinesText} onChange={(v) => setEditing({ ...editing, guidelinesText: v })} />
            <TextAreaField label="Eligibility (one per line)" value={editing.eligibilityText} onChange={(v) => setEditing({ ...editing, eligibilityText: v })} />
            <TextAreaField label="Prizes (one per line)" value={editing.prizesText} onChange={(v) => setEditing({ ...editing, prizesText: v })} />

            <div className="flex gap-4 justify-end pt-2">
              <button onClick={() => setEditing(null)} className="px-5 py-2 text-xs tracking-widest2 text-mist/60 border border-steel">CANCEL</button>
              <button onClick={save} disabled={saving} className="px-5 py-2 text-xs tracking-widest2 bg-cyan-400 text-void disabled:opacity-50">
                {saving ? "SAVING…" : "SAVE"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TextField({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-xs tracking-widest2 text-mist/50">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full bg-gunmetal border border-steel px-4 py-2.5 text-mist" />
    </label>
  );
}

function TextAreaField({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-xs tracking-widest2 text-mist/50">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="mt-2 w-full bg-gunmetal border border-steel px-4 py-2.5 text-mist" />
    </label>
  );
}
