import { Mail, Phone, MapPin } from "lucide-react";
import { siteConfig } from "../data/siteConfig";

export default function Contact() {
  const { contact } = siteConfig;

  return (
    <div className="pt-32 pb-24 section-pad max-w-3xl mx-auto">
      <h1 className="font-display text-3xl md:text-4xl text-mist mb-2">CONTACT</h1>
      <p className="text-mist/50 text-sm mb-12">{contact.department}, {siteConfig.collegeName}</p>

      <div className="grid gap-6 mb-12">
        <div className="glass-panel p-6 flex items-center gap-4">
          <MapPin className="text-cyan-400" size={20} />
          <span className="text-mist/80">{contact.address}</span>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4">
          <Mail className="text-cyan-400" size={20} />
          <a href={`mailto:${contact.email}`} className="text-mist/80 hover:text-mist">{contact.email}</a>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4">
          <Phone className="text-cyan-400" size={20} />
          <span className="text-mist/80">{contact.phone}</span>
        </div>
      </div>

      {(contact.coordinator.name || contact.coordinator.phone || contact.coordinator.email) && (
        <div className="mb-12">
          <h2 className="text-xs tracking-widest2 text-mist/50 mb-3">COORDINATOR</h2>
          <p className="text-mist/80">
            {contact.coordinator.name} {contact.coordinator.phone && `· ${contact.coordinator.phone}`}{" "}
            {contact.coordinator.email && `· ${contact.coordinator.email}`}
          </p>
        </div>
      )}

      <div className="flex gap-6 mb-12 text-sm text-mist/60">
        <a href={contact.social.instagram} className="hover:text-mist">Instagram</a>
        <a href={contact.social.linkedin} className="hover:text-mist">LinkedIn</a>
        <a href={contact.social.youtube} className="hover:text-mist">YouTube</a>
      </div>

      <div className="glass-panel h-64 flex items-center justify-center text-mist/30 text-sm">
        Campus map — add an embedded map once the venue is confirmed.
      </div>
    </div>
  );
}
