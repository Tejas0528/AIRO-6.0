const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema(
  {
    participant: { type: mongoose.Schema.Types.ObjectId, ref: "Participant", required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },

    teamName: { type: String, required: true, trim: true },
    teamMembers: [{ type: String, trim: true }], // additional member names, leader = participant

    registrationId: { type: String, required: true, unique: true }, // human-readable, e.g. AIRO6-XXXXXX
    qrToken: { type: String, required: true, unique: true }, // signed opaque token, no PII

    ticketStatus: {
      type: String,
      enum: ["ISSUED", "CANCELLED"],
      default: "ISSUED",
    },
  },
  { timestamps: true }
);

// One participant (by email+event) can't register twice for the same event.
RegistrationSchema.index({ participant: 1, event: 1 });

module.exports = mongoose.model("Registration", RegistrationSchema);
