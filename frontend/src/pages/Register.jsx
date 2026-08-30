import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import api, { extractErrorMessage } from "../lib/api";
import { CHARACTERS } from "../data/characters";
import EventPreviewPanel from "../components/EventPreviewPanel";
import CharacterPortrait from "../components/CharacterPortrait";

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];

export default function Register() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState(searchParams.get("event") || "");
  const [members, setMembers] = useState([""]); // additional team members beyond leader
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    collegeName: "",
    department: "",
    year: YEARS[0],
    registerNumber: "",
    gender: GENDERS[0],
    teamName: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [confirmedRegistrationId, setConfirmedRegistrationId] = useState(null);

  useEffect(() => {
    api.get("/events").then((res) => {
      setEvents(res.data.events);
      if (!selectedSlug && res.data.events[0]) setSelectedSlug(res.data.events[0].slug);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!confirmedRegistrationId) return;
    const t = setTimeout(() => navigate(`/ticket/${confirmedRegistrationId}`), 2200);
    return () => clearTimeout(t);
  }, [confirmedRegistrationId, navigate]);

  const event = useMemo(() => events.find((e) => e.slug === selectedSlug), [events, selectedSlug]);
  const cfg = event ? CHARACTERS[event.assignedCharacter] : null;
  const teamSize = 1 + members.filter((m) => m.trim()).length;

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addMember() {
    if (event && teamSize >= event.teamMax) return;
    setMembers((m) => [...m, ""]);
  }

  function removeMember(i) {
    if (event && teamSize <= event.teamMin) return;
    setMembers((m) => m.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!event) return;
    setSubmitting(true);
    try {
      const res = await api.post("/registrations", {
        ...form,
        eventSlug: selectedSlug,
        teamMembers: members,
      });
      toast.success("Registration successful!");
      setConfirmedRegistrationId(res.data.registration.id);
    } catch (err) {
      toast.error(extractErrorMessage(err, "Registration failed."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="pt-32 pb-24 section-pad max-w-6xl mx-auto">
      <h1 className="font-display text-3xl md:text-4xl text-mist mb-2">REGISTER FOR AIRO 6.0</h1>
      <p className="text-mist/50 mb-10 text-sm">Fill in your details to secure your spot.</p>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 items-start">
        {/* Assigned Transformer preview — updates live as the event changes */}
        <EventPreviewPanel event={event} />

        <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="text-xs tracking-widest2 text-mist/50">SELECT EVENT</label>
          <select
            value={selectedSlug}
            onChange={(e) => {
              setSelectedSlug(e.target.value);
              setMembers([""]);
            }}
            className="mt-2 w-full bg-gunmetal border border-steel px-4 py-3 text-mist"
            required
          >
            {events.map((ev) => (
              <option key={ev.slug} value={ev.slug}>{ev.name}</option>
            ))}
          </select>
        </div>

        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Full Name" value={form.fullName} onChange={(v) => updateField("fullName", v)} required />
          <Field label="Email" type="email" value={form.email} onChange={(v) => updateField("email", v)} required />
          <Field label="Phone Number" value={form.phone} onChange={(v) => updateField("phone", v)} required />
          <Field label="College Name" value={form.collegeName} onChange={(v) => updateField("collegeName", v)} required />
          <Field label="Department" value={form.department} onChange={(v) => updateField("department", v)} required />
          <SelectField label="Year" value={form.year} onChange={(v) => updateField("year", v)} options={YEARS} />
          <Field label="Register Number / Student ID" value={form.registerNumber} onChange={(v) => updateField("registerNumber", v)} required />
          <SelectField label="Gender" value={form.gender} onChange={(v) => updateField("gender", v)} options={GENDERS} />
          <Field label="Team Name" value={form.teamName} onChange={(v) => updateField("teamName", v)} required />
        </fieldset>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs tracking-widest2 text-mist/50">
              TEAM MEMBERS (you are the leader — {teamSize} total)
            </label>
            <div className="flex gap-2">
              <button type="button" onClick={addMember} className="p-1.5 border border-steel text-mist/70 hover:text-mist"><Plus size={14} /></button>
              <button type="button" onClick={() => removeMember(members.length - 1)} className="p-1.5 border border-steel text-mist/70 hover:text-mist"><Minus size={14} /></button>
            </div>
          </div>
          <div className="space-y-3">
            {members.map((m, i) => (
              <input
                key={i}
                value={m}
                onChange={(e) => {
                  const next = [...members];
                  next[i] = e.target.value;
                  setMembers(next);
                }}
                placeholder={`Member ${i + 2} full name`}
                className="w-full bg-gunmetal border border-steel px-4 py-3 text-mist"
                required
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 text-xs tracking-widest2 disabled:opacity-50"
          style={{ backgroundColor: cfg ? cfg.coreColor : "#3fb2ff", color: "#050607" }}
        >
          {submitting ? "SUBMITTING…" : "COMPLETE REGISTRATION"}
        </button>
        </form>
      </div>

      <AnimatePresence>
        {confirmedRegistrationId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-void/95 flex flex-col items-center justify-center"
          >
            <div className="relative w-64 h-80 md:w-80 md:h-96">
              <CharacterPortrait characterId={event?.assignedCharacter || "VOLTREX"} size="details" />
            </div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-2xl md:text-3xl text-mist tracking-widest2 mt-4"
              style={{ color: cfg?.coreColor }}
            >
              REGISTRATION CONFIRMED
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-mist/50 text-xs tracking-widest2 mt-2"
            >
              PREPARING YOUR AIRO 6.0 PASS…
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required }) {
  return (
    <label className="block">
      <span className="text-xs tracking-widest2 text-mist/50">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="mt-2 w-full bg-gunmetal border border-steel px-4 py-3 text-mist"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-xs tracking-widest2 text-mist/50">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full bg-gunmetal border border-steel px-4 py-3 text-mist">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
