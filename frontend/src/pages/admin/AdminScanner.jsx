import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { Camera, CameraOff } from "lucide-react";
import api, { extractErrorMessage } from "../../lib/api";

const STATUS_STYLES = {
  SUCCESS: { bg: "bg-green-500/10", border: "border-green-400/50", text: "text-green-400" },
  WRONG_EVENT: { bg: "bg-orange-500/10", border: "border-orange-400/50", text: "text-orange-400" },
  ALREADY_CHECKED_IN: { bg: "bg-yellow-500/10", border: "border-yellow-400/50", text: "text-yellow-400" },
  INVALID_TICKET: { bg: "bg-red-500/10", border: "border-red-400/50", text: "text-red-400" },
  ERROR: { bg: "bg-red-500/10", border: "border-red-400/50", text: "text-red-400" },
};

export default function AdminScanner() {
  const [events, setEvents] = useState([]);
  const [eventSlug, setEventSlug] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [cameraError, setCameraError] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const cooldownRef = useRef(false);

  useEffect(() => {
    api.get("/admin/events").then((res) => {
      setEvents(res.data.events);
      if (res.data.events[0]) setEventSlug(res.data.events[0].slug);
    });
  }, []);

  async function startScanner() {
    setCameraError("");
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setScanning(true);
      tick();
    } catch (err) {
      setCameraError("Could not access the camera. Check browser permissions and try again.");
    }
  }

  function stopScanner() {
    setScanning(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }

  function tick() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code && code.data && !cooldownRef.current) {
      handleScan(code.data);
    }

    rafRef.current = requestAnimationFrame(tick);
  }

  async function handleScan(qrToken) {
    cooldownRef.current = true;
    try {
      const res = await api.post("/attendance/scan", { qrToken, eventSlug });
      setResult({ status: "SUCCESS", ...res.data });
    } catch (err) {
      const data = err?.response?.data;
      setResult(data || { status: "ERROR", message: extractErrorMessage(err, "Scan failed.") });
    } finally {
      setTimeout(() => (cooldownRef.current = false), 2500); // avoid re-scanning the same code instantly
    }
  }

  useEffect(() => () => stopScanner(), []);

  const style = result ? STATUS_STYLES[result.status] || STATUS_STYLES.ERROR : null;

  return (
    <div>
      <h1 className="font-display text-2xl text-mist mb-8">QR ATTENDANCE SCANNER</h1>

      <label className="block mb-6 max-w-sm">
        <span className="text-xs tracking-widest2 text-mist/50">Scanning for event</span>
        <select value={eventSlug} onChange={(e) => setEventSlug(e.target.value)} className="mt-2 w-full bg-gunmetal border border-steel px-4 py-3 text-mist">
          {events.map((ev) => <option key={ev.slug} value={ev.slug}>{ev.name}</option>)}
        </select>
      </label>

      <div className="max-w-md">
        <div className="relative aspect-square bg-gunmetal border border-steel overflow-hidden mb-4">
          <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
          <canvas ref={canvasRef} className="hidden" />
          {!scanning && (
            <div className="absolute inset-0 flex items-center justify-center text-mist/40 text-sm">
              Camera is off
            </div>
          )}
        </div>

        {cameraError && <p className="text-red-400 text-sm mb-4">{cameraError}</p>}

        <div className="flex gap-4">
          {!scanning ? (
            <button onClick={startScanner} className="flex items-center gap-2 px-6 py-3 bg-cyan-400 text-void text-xs tracking-widest2">
              <Camera size={14} /> START SCANNER
            </button>
          ) : (
            <button onClick={stopScanner} className="flex items-center gap-2 px-6 py-3 border border-steel text-mist text-xs tracking-widest2">
              <CameraOff size={14} /> STOP SCANNER
            </button>
          )}
        </div>
      </div>

      {result && style && (
        <div className={`mt-8 max-w-md p-6 border ${style.border} ${style.bg}`}>
          <p className={`font-display text-lg mb-3 ${style.text}`}>{result.message}</p>
          {result.status === "SUCCESS" && (
            <dl className="space-y-1 text-sm text-mist/80">
              <p>Participant: {result.participant}</p>
              <p>Registration ID: {result.registrationId}</p>
              <p>Event: {result.event}</p>
              <p>Assigned Transformer: {result.assignedCharacter}</p>
              <p>Check-in time: {result.checkInTime}</p>
            </dl>
          )}
          {result.status === "WRONG_EVENT" && (
            <p className="text-sm text-mist/70">Registered for: {result.registeredFor}</p>
          )}
          {result.status === "ALREADY_CHECKED_IN" && (
            <p className="text-sm text-mist/70">Original check-in: {result.checkInDate} {result.checkInTime}</p>
          )}
        </div>
      )}
    </div>
  );
}
