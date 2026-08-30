const express = require("express");
const Event = require("../models/Event");

const router = express.Router();

// GET /api/events - public list, active only, ordered
router.get("/", async (req, res) => {
  try {
    const events = await Event.find({ active: true }).sort({ order: 1 });
    res.json({ events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load events right now." });
  }
});

// GET /api/events/:slug
router.get("/:slug", async (req, res) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug, active: true });
    if (!event) return res.status(404).json({ message: "Event not found." });
    res.json({ event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load this event right now." });
  }
});

module.exports = router;
