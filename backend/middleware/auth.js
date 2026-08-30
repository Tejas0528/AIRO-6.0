const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

async function requireAdmin(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Not authenticated." });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(payload.id).select("-passwordHash");
    if (!admin) return res.status(401).json({ message: "Not authenticated." });

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Session expired or invalid. Please log in again." });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return res.status(403).json({ message: "You don't have permission to do that." });
    }
    next();
  };
}

module.exports = { requireAdmin, requireRole };
