# AIRO 6.0 — College Technical Symposium Platform

A full-stack, cinematic event platform built around six original
robot characters (VOLTREX, INFERNIX, NEXARON, TITANOVA,
CYCLONEX, AURORION) — real character art, background-removed and blended
into the site's dark UI, animated with Framer Motion / GSAP.

```
airo6/
  backend/    Node + Express + MongoDB API
  frontend/   React + Vite + Three.js (React Three Fiber) + GSAP
```

## 1. Prerequisites

- Node.js 18+
- A MongoDB instance (local `mongod`, or a MongoDB Atlas connection string)

## 2. Backend setup

```bash
cd backend
cp .env.example .env
# edit .env: set MONGODB_URI, JWT_SECRET, QR_SIGNING_SECRET
npm install
npm run seed     # creates the 6 events + a default admin
npm run dev       # starts on http://localhost:5000
```

The seed script prints a default admin login:
`admin@airo6.local` / `ChangeMe123!` — **change this password immediately**
after your first login (there's no self-service password change endpoint
yet; update it directly via `Admin.setPassword()` in a one-off script, or
add a change-password route before going live).

## 3. Frontend setup

```bash
cd frontend
npm install
npm run dev        # starts on http://localhost:5173, proxies /api to :5000
```

Open http://localhost:5173.

## 4. Configuring real event details

Nothing in this codebase fabricates dates, venues, or coordinator contact
info — they're placeholders (`"TBA"` / empty strings) by design. Set the
real values from:

- `/admin/login` → **Events** → edit each event's date/time/venue/coordinator
- `frontend/src/data/siteConfig.js` → event date range, venue, college name,
  contact department/address/email/phone, coordinator, social links

## 5. What's implemented

- Real character portraits (`frontend/src/data/characters.js` + `public/characters/*.png`)
  — background-removed key art per character, blended into the site's dark
  UI, driven by per-character config (color, glow, entrance style).
- `CharacterPortrait.jsx` renders each character with a hover glow, ambient
  particle motes matching the character's core color, an idle bobbing loop,
  and a sweeping scan-line — plus a distinct entrance animation per
  character (six Framer Motion variants, keyed by `entrance` in
  `characters.js`).
- Event cards show the assigned character live and animated the moment the
  card scrolls into view (`EventRobotScene.jsx` → `CharacterPortrait.jsx`).
- Event details / registration pages show the same character large, with
  mouse-parallax tilt, particles, and cinematic glow (`"details"` size mode).
- The homepage hero (`CinematicScene.jsx`) shows the full six-character
  lineup team shot, edges pre-feathered to dissolve into the background,
  animated on a GSAP ScrollTrigger scrub (rises in, settles, steps aside,
  fades out as you scroll).
- A second homepage section (`TeamBanner.jsx`) composites the six
  individual cutouts into one continuous "team shot" banner.
- Full registration flow: dynamic team-size rules per event, email/phone/
  register-number validation, duplicate-registration prevention.
- Digital ticket generation with a signed QR token (no PII encoded in the
  QR — just an opaque id + HMAC signature) and PNG/PDF export.
- QR attendance scanner (`/admin/scanner`) using the device camera + jsQR,
  with explicit `SUCCESS` / `WRONG_EVENT` / `ALREADY_CHECKED_IN` /
  `INVALID_TICKET` states.
- Admin dashboard with per-event registration/attendance stats, event
  editor, registration browser + CSV export, attendance browser + CSV
  export.

## 6. Known simplifications (read before treating this as launch-ready)

This was built end-to-end in one working session, so a few things are
intentionally simplified rather than left as fake placeholders:

- **Character cutouts** are AI-segmented from key art (not hand-rotoscoped),
  so edge quality is very good but not pixel-perfect on every frame — worth
  a manual touch-up pass in an image editor before print/large-format use.
- **Admin roles** exist in the schema (`superadmin` / `coordinator` /
  `scanner`) but only `superadmin`/`coordinator` are wired into route
  permission checks — add a scanner-only login flow if you want to hand
  out camera-only accounts.
- **No password-reset / forgot-password flow** for admins yet.
- **Rate limiting** is a basic global limiter — tune per-route if you
  expect real traffic spikes (e.g. registration day).
- CSV export streams the full collection in memory — fine at symposium
  scale, not built for huge datasets.

## 7. Deployment notes

- Set `CLIENT_URL` in `backend/.env` to your deployed frontend origin (CORS).
- Never commit `.env`. `QR_SIGNING_SECRET` and `JWT_SECRET` must be long,
  random, and different from each other.
- Build the frontend with `npm run build` (outputs to `frontend/dist`) and
  serve it from any static host or behind the same reverse proxy as the API.
