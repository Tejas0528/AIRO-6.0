const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema(
  {
    registrationId: { type: mongoose.Schema.Types.ObjectId, ref: "Registration", required: true },
    participantId: { type: mongoose.Schema.Types.ObjectId, ref: "Participant", required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    qrToken: { type: String, required: true },

    checkInTime: { type: String, required: true }, // HH:mm:ss
    checkInDate: { type: String, required: true }, // YYYY-MM-DD

    status: {
      type: String,
      enum: ["PRESENT"],
      default: "PRESENT",
    },

    scannedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  },
  { timestamps: true }
);

AttendanceSchema.index({ registrationId: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", AttendanceSchema);
