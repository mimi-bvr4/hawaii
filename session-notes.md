# Session notes (newest first)

## 2026-06-15 — initial build
- Scaffolded Node/Express + Postgres app per IHG playbook. Read-only; Google Sheet is source of truth.
- Screens: Home (countdown + island chips + stats + Reservations status strip), Flights, Stays, Days, Info. Bottom nav, mobile-first, Hawaii theme.
- Auth: single family passcode (bcrypt hash in settings, seeded from APP_PIN), JWT cookie. /api/data requires auth (401 otherwise).
- Sheets read layer: service account, readonly scope, 60s cache, batchGet of 6 tabs. Sheet contract: title row, header row, data.
- TODO to go live: convert source xlsx -> native Google Sheet; create GCP service account + share Sheet; set Railway env vars; generate domain on port 8080; security pre-flight; verify live.
