# Replays System

A recording pipeline for a Hikvision NVR: a local service pulls recorded footage from the NVR on a schedule, uploads it to a remote server, and a web app lets viewers browse and play back the footage by date/time slot.

## Structure

- **`Server/`** — Runs on-site next to the NVR. On a daily cron schedule (and once on startup), it downloads recorded video segments from the Hikvision NVR for a configured time range and camera list, then deletes local copies older than a few days.
  - `index.js` — entry point, kicks off the immediate + scheduled recording jobs
  - `scheduler.js` — builds the hourly time slots for a day and requests each one
  - `controllers/hikvision.js` — talks to the NVR's API to fetch recordings
  - `uploader.js` — pushes downloaded files to the remote server
  - `cleanup.js` — deletes local recordings past a retention window

- **`RemoteServer/`** — A small Express + Multer upload endpoint (`/api/upload`) that receives recording files from `Server/` and stores them, with an hourly job that deletes files older than 3 days.

- **`View/`** — A React (Vite) web app for browsing recordings by calendar date and time slot and playing them back.

## Requirements

- Node.js
- A reachable Hikvision NVR (for `Server/`)

## Setup

Each app has its own dependencies and config.

### Server

```bash
cd Server
npm install
cp .env.example .env   # fill in NVR_IP, NVR_USER, NVR_PASS, PORT
npm start
```

### RemoteServer

```bash
cd RemoteServer
npm install
node server.js
```

### View

```bash
cd View
npm install
npm run dev
```

## Notes

- `Server/.env` holds NVR credentials and is git-ignored — never commit real credentials. Use `Server/.env.example` as the template.
