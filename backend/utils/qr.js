const crypto = require("crypto");
const QRCode = require("qrcode");
const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 8);

function genRegistrationId() {
  return `AIRO6-${nanoid()}`;
}

// The QR token is an opaque, signed reference. It intentionally contains no
// personal data — only a random id plus an HMAC signature so the backend can
// verify it hasn't been tampered with.
function signQrToken(rawId) {
  const secret = process.env.QR_SIGNING_SECRET;
  if (!secret) throw new Error("QR_SIGNING_SECRET is not set");
  const sig = crypto.createHmac("sha256", secret).update(rawId).digest("hex").slice(0, 16);
  return `${rawId}.${sig}`;
}

function verifyQrToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [rawId, sig] = token.split(".");
  const expected = signQrToken(rawId).split(".")[1];
  if (sig !== expected) return null;
  return rawId;
}

function newSignedToken() {
  const rawId = crypto.randomBytes(12).toString("hex");
  return signQrToken(rawId);
}

async function generateQrDataUrl(token) {
  return QRCode.toDataURL(token, { errorCorrectionLevel: "M", margin: 1, width: 400 });
}

module.exports = { genRegistrationId, newSignedToken, verifyQrToken, generateQrDataUrl };
