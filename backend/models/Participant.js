const mongoose = require("mongoose");

const ParticipantSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    collegeName: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    year: { type: String, required: true },
    registerNumber: { type: String, required: true, trim: true },
    gender: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Participant", ParticipantSchema);
