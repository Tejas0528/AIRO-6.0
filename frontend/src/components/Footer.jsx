import { Link } from "react-router-dom";
import { siteConfig } from "../data/siteConfig";

export default function Footer() {
  return (
    <footer className="border-t border-steel/40 bg-void section-pad py-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        <div>
          <p className="font-display text-lg tracking-widest2 text-mist mb-2">
            AIRO <span className="text-cyan-400">6.0</span>
          </p>
          <p className="text-sm text-mist/50 max-w-xs">{siteConfig.tagline}</p>
        </div>
        <div className="flex gap-10 text-sm">
          <div className="flex flex-col gap-2">
            <Link to="/events" className="text-mist/60 hover:text-mist">Events</Link>
            <Link to="/schedule" className="text-mist/60 hover:text-mist">Schedule</Link>
            <Link to="/about" className="text-mist/60 hover:text-mist">About</Link>
          </div>
          <div className="flex flex-col gap-2">
            <Link to="/contact" className="text-mist/60 hover:text-mist">Contact</Link>
            <a href="/admin/login" className="text-mist/40 hover:text-mist/70 text-xs">Admin</a>
          </div>
        </div>
      </div>
      <p className="text-xs text-mist/30 mt-10 text-center">© {new Date().getFullYear()} AIRO 6.0 — {siteConfig.collegeName}</p>
    </footer>
  );
}
