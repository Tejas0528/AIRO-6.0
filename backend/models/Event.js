const mongoose = require("mongoose");

const CHARACTERS = [
  "VOLTREX",
  "INFERNIX",
  "NEXARON",
  "TITANOVA",
  "CYCLONEX",
  "AURORION",
];

const EventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },

    // Duration is intentionally a free-form string ("60-90 mins") and may be
    // null/empty (e.g. the Agentic AI Workshop must NOT show a fixed duration).
    duration: { type: String, default: null },
    hasFixedDuration: { type: Boolean, default: true },

    teamMin: { type: Number, required: true, min: 1 },
    teamMax: { type: Number, required: true, min: 1 },

    fee: { type: Number, default: 0 }, // in INR, 0 = free

    assignedCharacter: { type: String, enum: CHARACTERS, required: true },

    rounds: [{ type: String }], // e.g. Code Combat's 3 rounds

    rules: [{ type: String }],
    guidelines: [{ type: String }],
    eligibility: [{ type: String }],
    prizes: [{ type: String }],

    date: { type: String, default: null }, // configurable, not fabricated
    time: { type: String, default: null },
    venue: { type: String, default: null },

    coordinator: {
      name: { type: String, default: "" },
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
    },

    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

EventSchema.index({ order: 1 });

module.exports = mongoose.model("Event", EventSchema);
module.exports.CHARACTERS = CHARACTERS;
