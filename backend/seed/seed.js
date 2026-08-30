require("dotenv").config();
const connectDB = require("../config/db");
const Event = require("../models/Event");
const Admin = require("../models/Admin");

const events = [
  {
    name: "TECH AUCTION",
    slug: "tech-auction",
    description:
      "Teams strategically bid for technologies using virtual currency and develop a solution using the technologies they acquire.",
    category: "Technical",
    duration: "60-90 mins",
    hasFixedDuration: true,
    teamMin: 3,
    teamMax: 4,
    fee: 0,
    assignedCharacter: "VOLTREX",
    rules: [],
    guidelines: [],
    eligibility: [],
    prizes: [],
    order: 1,
  },
  {
    name: "TECH CRIME SCENE",
    slug: "tech-crime-scene",
    description:
      "A simulated cybercrime investigation where participants analyze digital evidence to identify the attacker, attack method, and exploited vulnerability.",
    category: "Technical / Cybersecurity",
    duration: "1.5-2 hrs",
    hasFixedDuration: true,
    teamMin: 3,
    teamMax: 4,
    fee: 0,
    assignedCharacter: "TITANOVA",
    rules: [],
    guidelines: [],
    eligibility: [],
    prizes: [],
    order: 2,
  },
  {
    name: "AGENTIC PARADOX",
    slug: "agentic-paradox",
    description:
      "Teams develop an AI agent based on a selected theme and adapt it to an unseen challenge during the final round.",
    category: "AI / Technical",
    duration: "1.5-2 hrs",
    hasFixedDuration: true,
    teamMin: 3,
    teamMax: 3,
    fee: 0,
    assignedCharacter: "NEXARON",
    rules: [],
    guidelines: [],
    eligibility: [],
    prizes: [],
    order: 3,
  },
  {
    name: "AGENTIC AI WORKSHOP",
    slug: "agentic-ai-workshop",
    description:
      "An interactive hands-on workshop introducing participants to Agentic AI, autonomous AI agents, agent workflows and practical approaches to building intelligent systems.",
    category: "Workshop",
    duration: null,
    hasFixedDuration: false,
    teamMin: 3,
    teamMax: 3,
    fee: 300,
    assignedCharacter: "AURORION",
    rules: [],
    guidelines: [],
    eligibility: [],
    prizes: [],
    order: 4,
  },
  {
    name: "PAPER PRESENTATION",
    slug: "paper-presentation",
    description:
      "Participants present research, innovative ideas, emerging technologies or technical solutions on a selected topic before a panel of judges. Presentations are evaluated on technical knowledge, originality, clarity, research depth and the ability to answer questions from the judges.",
    category: "Technical",
    duration: "1.5-2 hrs",
    hasFixedDuration: true,
    teamMin: 3,
    teamMax: 4,
    fee: 0,
    assignedCharacter: "INFERNIX",
    rules: [],
    guidelines: [],
    eligibility: [],
    prizes: [],
    order: 5,
  },
  {
    name: "CODE COMBAT",
    slug: "code-combat",
    description:
      "A multi-round coding battle designed to test debugging skills, problem-solving ability, data structures and algorithms knowledge, and understanding of real-world company-based coding questions.",
    category: "Technical / Coding",
    duration: "1.5-2 hrs",
    hasFixedDuration: true,
    teamMin: 3,
    teamMax: 4,
    fee: 0,
    assignedCharacter: "CYCLONEX",
    rounds: ["01 — DEBUGGING", "02 — DSA SOLVING", "03 — COMPANY QUESTIONS"],
    rules: [],
    guidelines: [],
    eligibility: [],
    prizes: [],
    order: 6,
  },
];

async function run() {
  await connectDB();

  for (const e of events) {
    await Event.findOneAndUpdate({ slug: e.slug }, e, { upsert: true, new: true, setDefaultsOnInsert: true });
    console.log(`[seed] upserted event: ${e.name}`);
  }

  const adminEmail = "admin@airo6.local";
  let admin = await Admin.findOne({ email: adminEmail });
  if (!admin) {
    admin = new Admin({ name: "AIRO 6.0 Super Admin", email: adminEmail, role: "superadmin" });
    await admin.setPassword("ChangeMe123!"); // change immediately after first login
    await admin.save();
    console.log(`[seed] created default admin -> ${adminEmail} / ChangeMe123!  (CHANGE THIS PASSWORD)`);
  } else {
    console.log("[seed] default admin already exists, skipping.");
  }

  console.log("[seed] done.");
  process.exit(0);
}

run().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
