import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const LINKS = [
  { to: "/", label: "HOME" },
  { to: "/events", label: "EVENTS" },
  { to: "/schedule", label: "SCHEDULE" },
  { to: "/events/agentic-ai-workshop", label: "WORKSHOP" },
  { to: "/about", label: "ABOUT" },
  { to: "/contact", label: "CONTACT" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-panel" : "bg-transparent"
      }`}
    >
      <nav className="section-pad flex items-center justify-between h-20">
        <Link to="/" className="font-display text-xl tracking-widest2 text-mist">
          AIRO <span className="text-cyan-400">6.0</span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm tracking-widest2 font-medium transition-colors ${
                  isActive ? "text-cyan-400" : "text-mist/80 hover:text-mist"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/events"
            className="border border-cyan-400/60 text-cyan-400 text-sm tracking-widest2 px-5 py-2 hover:bg-cyan-400/10 transition-colors"
          >
            REGISTER NOW
          </Link>
        </div>

        <button className="lg:hidden text-mist" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden glass-panel section-pad pb-6 flex flex-col gap-4">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-mist/90 tracking-widest2 text-sm">
              {l.label}
            </NavLink>
          ))}
          <Link to="/events" onClick={() => setOpen(false)} className="text-cyan-400 tracking-widest2 text-sm">
            REGISTER NOW
          </Link>
        </div>
      )}
    </header>
  );
}
