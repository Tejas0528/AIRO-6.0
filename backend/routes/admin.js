const express = require("express");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const Attendance = require("../models/Attendance");
const { requireAdmin, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(requireAdmin);

// ---------- Dashboard ----------
router.get("/dashboard", async (req, res) => {
  try {
    const [totalRegistrations, totalAttendance, events, regByEventAgg, attByEventAgg] = await Promise.all([
      Registration.countDocuments(),
      Attendance.countDocuments(),
      Event.find().sort({ order: 1 }),
      Registration.aggregate([{ $group: { _id: "$event", count: { $sum: 1 } } }]),
      Attendance.aggregate([{ $group: { _id: "$eventId", count: { $sum: 1 } } }]),
    ]);

    const regMap = Object.fromEntries(regByEventAgg.map((r) => [String(r._id), r.count]));
    const attMap = Object.fromEntries(attByEventAgg.map((r) => [String(r._id), r.count]));

    const eventStats = events.map((e) => {
      const registrations = regMap[String(e._id)] || 0;
      const present = attMap[String(e._id)] || 0;
      return {
        eventId: e._id,
        name: e.name,
        assignedCharacter: e.assignedCharacter,
        registrations,
        present,
        absent: Math.max(registrations - present, 0),
        attendancePercentage: registrations ? Math.round((present / registrations) * 100) : 0,
      };
    });

    res.json({
      totals: {
        registrations: totalRegistrations,
        attendance: totalAttendance,
        absent: Math.max(totalRegistrations - totalAttendance, 0),
        attendancePercentage: totalRegistrations
          ? Math.round((totalAttendance / totalRegistrations) * 100)
          : 0,
      },
      eventStats,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load dashboard data." });
  }
});

// ---------- Events ----------
router.get("/events", async (req, res) => {
  const events = await Event.find().sort({ order: 1 });
  res.json({ events });
});

router.put("/events/:id", requireRole("superadmin", "coordinator"), async (req, res) => {
  try {
    const allowed = [
      "name", "description", "duration", "hasFixedDuration", "teamMin", "teamMax",
      "fee", "assignedCharacter", "rounds", "rules", "guidelines", "eligibility",
      "prizes", "date", "time", "venue", "coordinator", "active",
    ];
    const update = {};
    for (const key of allowed) {
      if (key in req.body) update[key] = req.body[key];
    }
    const event = await Event.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ message: "Event not found." });
    res.json({ event });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Could not update event. Check the fields and try again." });
  }
});

// ---------- Registrations ----------
router.get("/registrations", async (req, res) => {
  try {
    const { event, q } = req.query;
    const filter = {};
    if (event) {
      const ev = await Event.findOne({ slug: event });
      if (ev) filter.event = ev._id;
    }

    let query = Registration.find(filter).populate("participant").populate("event").sort({ createdAt: -1 });
    let registrations = await query;

    if (q) {
      const needle = q.toLowerCase();
      registrations = registrations.filter(
        (r) =>
          r.participant.fullName.toLowerCase().includes(needle) ||
          r.participant.email.toLowerCase().includes(needle) ||
          r.registrationId.toLowerCase().includes(needle) ||
          r.teamName.toLowerCase().includes(needle)
      );
    }

    res.json({ registrations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load registrations." });
  }
});

router.get("/registrations/:id", async (req, res) => {
  const registration = await Registration.findById(req.params.id).populate("participant").populate("event");
  if (!registration) return res.status(404).json({ message: "Registration not found." });
  res.json({ registration });
});

router.delete("/registrations/:id", requireRole("superadmin"), async (req, res) => {
  const registration = await Registration.findByIdAndDelete(req.params.id);
  if (!registration) return res.status(404).json({ message: "Registration not found." });
  await Attendance.deleteOne({ registrationId: registration._id });
  res.json({ message: "Registration deleted." });
});

router.get("/registrations-export.csv", async (req, res) => {
  const registrations = await Registration.find().populate("participant").populate("event").sort({ createdAt: -1 });
  const header = "RegistrationID,Name,Email,Phone,College,Department,Year,RegisterNumber,Event,TeamName,TeamMembers,CreatedAt\n";
  const rows = registrations.map((r) =>
    [
      r.registrationId,
      r.participant.fullName,
      r.participant.email,
      r.participant.phone,
      r.participant.collegeName,
      r.participant.department,
      r.year,
      r.participant.registerNumber,
      r.event.name,
      r.teamName,
      r.teamMembers.join(" | "),
      r.createdAt.toISOString(),
    ]
      .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
      .join(",")
  );
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=airo6-registrations.csv");
  res.send(header + rows.join("\n"));
});

// ---------- Attendance ----------
router.get("/attendance", async (req, res) => {
  try {
    const { event, date, q } = req.query;
    const filter = {};
    if (event) {
      const ev = await Event.findOne({ slug: event });
      if (ev) filter.eventId = ev._id;
    }
    if (date) filter.checkInDate = date;

    let records = await Attendance.find(filter)
      .populate("participantId")
      .populate("eventId")
      .sort({ createdAt: -1 });

    if (q) {
      const needle = q.toLowerCase();
      records = records.filter((r) => r.participantId.fullName.toLowerCase().includes(needle));
    }

    res.json({ attendance: records });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load attendance." });
  }
});

router.get("/attendance-export.csv", async (req, res) => {
  const records = await Attendance.find().populate("participantId").populate("eventId").sort({ createdAt: -1 });
  const header = "Participant,Event,CheckInDate,CheckInTime,Status\n";
  const rows = records.map((r) =>
    [r.participantId.fullName, r.eventId.name, r.checkInDate, r.checkInTime, r.status]
      .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
      .join(",")
  );
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=airo6-attendance.csv");
  res.send(header + rows.join("\n"));
});

module.exports = router;
