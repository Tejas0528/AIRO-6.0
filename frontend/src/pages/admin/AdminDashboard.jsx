import { useEffect, useState } from "react";
import api from "../../lib/api";
import { CHARACTERS } from "../../data/characters";

function StatCard({ label, value }) {
  return (
    <div className="glass-panel p-6">
      <p className="text-xs tracking-widest2 text-mist/50 mb-2">{label}</p>
      <p className="font-display text-3xl text-mist">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/admin/dashboard").then((res) => setData(res.data));
  }, []);

  if (!data) return <p className="text-mist/50">Loading dashboard…</p>;

  return (
    <div>
      <h1 className="font-display text-2xl text-mist mb-8">DASHBOARD</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Registrations" value={data.totals.registrations} />
        <StatCard label="Total Attendance" value={data.totals.attendance} />
        <StatCard label="Absent" value={data.totals.absent} />
        <StatCard label="Attendance %" value={`${data.totals.attendancePercentage}%`} />
      </div>

      <h2 className="text-xs tracking-widest2 text-mist/50 mb-4">EVENT-WISE ATTENDANCE</h2>
      <div className="space-y-3">
        {data.eventStats.map((ev) => {
          const cfg = CHARACTERS[ev.assignedCharacter];
          return (
            <div key={ev.eventId} className="glass-panel p-5 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs" style={{ color: cfg.coreColor }}>{cfg.label}</p>
                <p className="text-mist">{ev.name}</p>
              </div>
              <div className="flex gap-6 text-sm text-mist/60">
                <span>Registered: {ev.registrations}</span>
                <span>Present: {ev.present}</span>
                <span>Absent: {ev.absent}</span>
                <span>{ev.attendancePercentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
