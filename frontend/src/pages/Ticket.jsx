import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, FileDown, QrCode } from "lucide-react";
import api, { extractErrorMessage } from "../lib/api";
import { CHARACTERS } from "../data/characters";
import CharacterPortrait from "../components/CharacterPortrait";

export default function Ticket() {
  const { registrationId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");
  const ticketRef = useRef(null);

  useEffect(() => {
    api
      .get(`/registrations/${registrationId}/ticket`)
      .then((res) => setTicket(res.data.ticket))
      .catch((err) => setError(extractErrorMessage(err, "Ticket not found.")));
  }, [registrationId]);

  async function downloadImage() {
    if (!ticketRef.current) return;
    const canvas = await html2canvas(ticketRef.current, { backgroundColor: "#0d0f11", scale: 2 });
    const link = document.createElement("a");
    link.download = `${ticket.registrationId}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  async function downloadPdf() {
    if (!ticketRef.current) return;
    const canvas = await html2canvas(ticketRef.current, { backgroundColor: "#0d0f11", scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width, canvas.height] });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${ticket.registrationId}.pdf`);
  }

  if (error) {
    return <div className="h-screen flex items-center justify-center text-mist/60">{error}</div>;
  }

  if (!ticket) {
    return <div className="h-screen flex items-center justify-center text-mist/50">Loading ticket…</div>;
  }

  const cfg = CHARACTERS[ticket.event.assignedCharacter];

  return (
    <div className="pt-32 pb-24 section-pad max-w-2xl mx-auto">
      <h1 className="font-display text-2xl md:text-3xl text-mist text-center mb-2">YOUR AIRO 6.0 EVENT PASS</h1>
      <p className="text-center text-mist/50 text-sm mb-10">Present this at check-in for {ticket.event.name}.</p>

      <div ref={ticketRef} className="glass-panel border-t-2 overflow-hidden" style={{ borderColor: cfg.coreColor }}>
        <div className="h-40 relative" style={{ background: `radial-gradient(circle at 50% 30%, ${cfg.palette.accent}55, #050607 80%)` }}>
          <CharacterPortrait characterId={ticket.event.assignedCharacter} size="card" />
        </div>

        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="font-display text-sm tracking-widest2 text-mist">AIRO 6.0</p>
              <p className="text-xs" style={{ color: cfg.coreColor }}>{cfg.label} · {ticket.event.name}</p>
            </div>
            <span className="text-xs px-3 py-1 border border-cyan-400/40 text-cyan-400 tracking-widest2">
              {ticket.ticketStatus}
            </span>
          </div>

          <dl className="grid grid-cols-2 gap-4 text-sm mb-6">
            <Detail label="Participant" value={ticket.participant.fullName} />
            <Detail label="Registration ID" value={ticket.registrationId} />
            <Detail label="College" value={ticket.participant.collegeName} />
            <Detail label="Team" value={ticket.teamName} />
            {ticket.event.date && <Detail label="Date" value={ticket.event.date} />}
            {ticket.event.time && <Detail label="Time" value={ticket.event.time} />}
            {ticket.event.venue && <Detail label="Venue" value={ticket.event.venue} />}
          </dl>

          {ticket.teamMembers?.length > 0 && (
            <p className="text-xs text-mist/50 mb-6">Team members: {ticket.teamMembers.join(", ")}</p>
          )}

          <div className="flex items-center gap-4 border-t border-steel/40 pt-6">
            <img src={ticket.qrDataUrl} alt="Ticket QR code" className="w-28 h-28 bg-white p-1" />
            <div className="text-xs text-mist/50 flex items-center gap-2">
              <QrCode size={14} /> Scan at the event entrance for attendance check-in.
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-8 justify-center">
        <button onClick={downloadImage} className="flex items-center gap-2 px-6 py-3 border border-mist/30 text-mist text-xs tracking-widest2 hover:border-mist/60">
          <Download size={14} /> DOWNLOAD TICKET
        </button>
        <button onClick={downloadPdf} className="flex items-center gap-2 px-6 py-3 border border-cyan-400/50 text-cyan-400 text-xs tracking-widest2 hover:bg-cyan-400/10">
          <FileDown size={14} /> DOWNLOAD PDF
        </button>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <dt className="text-mist/40 text-xs tracking-widest2 mb-1">{label}</dt>
      <dd className="text-mist/90">{value}</dd>
    </div>
  );
}
