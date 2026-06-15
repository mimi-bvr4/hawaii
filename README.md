# Hawaii ʻOhana Reunion 2026 — Planning App

Read-only, phone-first family trip app. The source of truth is a Google Sheet; the app reads it and renders five screens (Home, Flights, Stays, Days, Info). Family views behind a shared passcode; editing happens in the Sheet (shared with Mimi + the travel agent only).

## Stack
Node/Express + Postgres (one `settings` row for the passcode hash) on Railway. Reads the Sheet via the Google Sheets API with a read-only service account.

## Env vars (set in Railway — never commit)
- `DATABASE_URL` — reference `${{Postgres.DATABASE_URL}}`
- `JWT_SECRET` — long random string
- `APP_PIN` — seeds the family passcode on FIRST boot only (change later in DB)
- `SHEET_ID` — the **native** Google Sheet id (convert from .xlsx first)
- `GOOGLE_SERVICE_ACCOUNT_JSON` — full service-account JSON (one line); share the Sheet (Viewer) with its `client_email`
- `PORT` — Railway injects 8080

## Sheet contract
Each tab: row 1 = title banner, row 2 = column headers, row 3+ = data. Tabs read: Trip, Flights, Lodging, Reservations, Schedule, Contacts & Links.
