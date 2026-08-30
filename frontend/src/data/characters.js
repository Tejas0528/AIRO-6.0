// Single source of truth for the six original AIRO 6.0 characters.
// Visuals are real character portraits (public/characters/*.png) — cut out
// from the character key-art, background removed, edges blended to sit
// naturally against the site's near-black (#050607) background. `entrance`
// selects a distinct motion style per character in <CharacterPortrait />.

export const CHARACTERS = {
  VOLTREX: {
    id: "VOLTREX",
    label: "VOLTREX",
    image: "/characters/voltrex.png",
    palette: { accent: "#0a1f4d" },
    coreColor: "#3fb2ff",
    personality: "heroic",
    entrance: "confident-heroic",
  },
  INFERNIX: {
    id: "INFERNIX",
    label: "INFERNIX",
    image: "/characters/infernix.png",
    palette: { accent: "#3a0505" },
    coreColor: "#ff5a2e",
    personality: "aggressive",
    entrance: "fast-aggressive",
  },
  NEXARON: {
    id: "NEXARON",
    label: "NEXARON",
    image: "/characters/nexaron.png",
    palette: { accent: "#0d2a12" },
    coreColor: "#7ef542",
    personality: "precise",
    entrance: "precise-intelligent",
  },
  TITANOVA: {
    id: "TITANOVA",
    label: "TITANOVA",
    image: "/characters/titanova.png",
    palette: { accent: "#3d2c05" },
    coreColor: "#f0b429",
    personality: "powerful",
    entrance: "heavy-powerful",
  },
  CYCLONEX: {
    id: "CYCLONEX",
    label: "CYCLONEX",
    image: "/characters/cyclonex.png",
    palette: { accent: "#22103d" },
    coreColor: "#a855f7",
    personality: "dynamic",
    entrance: "dynamic-fast",
  },
  AURORION: {
    id: "AURORION",
    label: "AURORION",
    image: "/characters/aurorion.png",
    palette: { accent: "#0a1f3d" },
    coreColor: "#4fc3ff",
    personality: "friendly",
    entrance: "energetic-friendly",
  },
};

export const CHARACTER_LIST = Object.values(CHARACTERS);
