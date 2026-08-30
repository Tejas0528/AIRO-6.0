const express = require("express");
const Event = require("../models/Event");
const Participant = require("../models/Participant");
const Registration = require("../models/Registration");
const { genRegistrationId, newSignedToken, generateQrDataUrl } = require("../utils/qr");

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[6-9]\d{9}$/; // Indian 10-digit mobile, adjust as needed
const REG_NO_RE = /^[A-Za-z0-9\-\/]{3,30}$/;

function fail(res, code, message, field) {
  return res.status(code).json({ message, field });
}

router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      collegeName,
      department,
      year,
      registerNumber,
      gender,
      eventSlug,
      teamName,
      teamMembers, // array of strings, additional members beyond the leader
    } = req.body;

    // --- required fields ---
    const required = { fullName, email, phone, collegeName, department, year, registerNumber, gender, eventSlug, teamName };
    for (const [key, val] of Object.entries(required)) {
      if (!val || (typeof val === "string" && !val.trim())) {
        return fail(res, 400, `${key} is required.`, key);
      }
    }

    if (!EMAIL_RE.test(email)) return fail(res, 400, "Please enter a valid email address.", "email");
    if (!PHONE_RE.test(phone)) return fail(res, 400, "Please enter a valid 10-digit phone number.", "phone");
    if (!REG_NO_RE.test(registerNumber)) return fail(res, 400, "Please enter a valid register number / student ID.", "registerNumber");

    const event = await Event.findOne({ slug: eventSlug, active: true });
    if (!event) return fail(res, 404, "Selected event was not found.", "eventSlug");

    // --- team size validation ---
    const members = Array.isArray(teamMembers) ? teamMembers.filter((m) => m && m.trim()) : [];
    const teamSize = 1 + members.length; // leader + members
    if (teamSize < event.teamMin || teamSize > event.teamMax) {
      const label = event.teamMin === event.teamMax ? `${event.teamMin}` : `${event.teamMin}-${event.teamMax}`;
      return fail(res, 400, `Team size for ${event.name} must be ${label} members.`, "teamMembers");
    }

    // --- duplicate registration prevention (same email + same event) ---
    const existingParticipant = await Participant.findOne({ email: email.toLowerCase().trim() });
    if (existingParticipant) {
      const dupe = await Registration.findOne({ participant: existingParticipant._id, event: event._id });
      if (dupe) {
        return fail(res, 409, "This email is already registered for this event.", "email");
      }
    }

    const participant =
      existingParticipant ||
      (await Participant.create({
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        collegeName: collegeName.trim(),
        department: department.trim(),
        year,
        registerNumber: registerNumber.trim(),
        gender,
      }));

    const registrationId = genRegistrationId();
    const qrToken = newSignedToken();

    const registration = await Registration.create({
      participant: participant._id,
      event: event._id,
      teamName: teamName.trim(),
      teamMembers: members.map((m) => m.trim()),
      registrationId,
      qrToken,
      ticketStatus: "ISSUED",
    });

    res.status(201).json({
      message: "Registration successful.",
      registration: { id: registration._id, registrationId: registration.registrationId },
    });
  } catch (err) {
    if (err.code === 11000) {
      return fail(res, 409, "It looks like this registration already exists.", null);
    }
    console.error(err);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
});

// GET /api/registrations/:id/ticket -> full ticket payload incl. QR image
router.get("/:id/ticket", async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate("participant")
      .populate("event");

    if (!registration) return res.status(404).json({ message: "Ticket not found." });

    const qrDataUrl = await generateQrDataUrl(registration.qrToken);

    res.json({
      ticket: {
        registrationId: registration.registrationId,
        ticketStatus: registration.ticketStatus,
        teamName: registration.teamName,
        teamMembers: registration.teamMembers,
        participant: {
          fullName: registration.participant.fullName,
          collegeName: registration.participant.collegeName,
        },
        event: {
          name: registration.event.name,
          slug: registration.event.slug,
          assignedCharacter: registration.event.assignedCharacter,
          date: registration.event.date,
          time: registration.event.time,
          venue: registration.event.venue,
        },
        qrDataUrl,
        createdAt: registration.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load ticket." });
  }
});

module.exports = router;
