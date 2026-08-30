const express = require("express");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) return res.status(401).json({ message: "Invalid credentials." });

    const ok = await admin.checkPassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials." });

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });

    res.json({
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

router.get("/me", requireAdmin, (req, res) => {
  res.json({ admin: req.admin });
});

module.exports = router;
