const express = require("express");
const Registration = require("../models/Registration");
const Attendance = require("../models/Attendance");
const Event = require("../models/Event");
const { verifyQrToken } = require("../utils/qr");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

function nowParts() {
  const d = new Date();
  return {
    checkInDate: d.toISOString().slice(0, 10),
    checkInTime: d.toTimeString().slice(0, 8),
  };
}

// POST /api/attendance/scan  { qrToken, eventSlug }
router.post("/scan", requireAdmin, async (req, res) => {
  try {
    const { qrToken, eventSlug } = req.body;
    if (!qrToken || !eventSlug) {
      return res.status(400).json({ status: "INVALID_TICKET", message: "Missing QR token or event." });
    }

    const rawId = verifyQrToken(qrToken);
    if (!rawId) {
      return res.status(400).json({ status: "INVALID_TICKET", message: "INVALID TICKET" });
    }

    const registration = await Registration.findOne({ qrToken })
      .populate("participant")
      .populate("event");

    if (!registration || registration.ticketStatus !== "ISSUED") {
      return res.status(404).json({ status: "INVALID_TICKET", message: "INVALID TICKET" });
    }

    const scanEvent = await Event.findOne({ slug: eventSlug });
    if (!scanEvent) {
      return res.status(404).json({ status: "INVALID_TICKET", message: "Scanning event not found." });
    }

    if (String(registration.event._id) !== String(scanEvent._id)) {
      return res.status(409).json({
        status: "WRONG_EVENT",
        message: "WRONG EVENT",
        registeredFor: registration.event.name,
      });
    }

    const existing = await Attendance.findOne({ registrationId: registration._id });
    if (existing) {
      return res.status(409).json({
        status: "ALREADY_CHECKED_IN",
        message: "ALREADY CHECKED IN",
        checkInTime: existing.checkInTime,
        checkInDate: existing.checkInDate,
      });
    }

    const { checkInDate, checkInTime } = nowParts();
    const attendance = await Attendance.create({
      registrationId: registration._id,
      participantId: registration.participant._id,
      eventId: registration.event._id,
      qrToken,
      checkInDate,
      checkInTime,
      status: "PRESENT",
      scannedBy: req.admin._id,
    });

    res.json({
      status: "SUCCESS",
      message: "CHECK-IN SUCCESSFUL",
      participant: registration.participant.fullName,
      registrationId: registration.registrationId,
      event: registration.event.name,
      assignedCharacter: registration.event.assignedCharacter,
      checkInTime: attendance.checkInTime,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "ERROR", message: "Scan failed. Please try again." });
  }
});

module.exports = router;
