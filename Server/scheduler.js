// scheduler.js (Node 12 / Windows 7 compatible)
const { saveRecording } = require("./controllers/hikvision");

const CAMERAS = [1601];

function pad(n) {
  return String(n).padStart(2, "0");
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

async function startDailyRecording(startHour, endHour) {
  const today = new Date().toISOString().slice(0, 10);

  for (const cam of CAMERAS) {
    for (let h = startHour; h !== endHour; h = (h + 1) % 24) {
      const next = (h + 1) % 24;

      const startSlot = `${pad(h)}:00:00`;
      const endSlot = `${pad(next)}:00:00`;

      const slot = `${startSlot}-${endSlot}`;

      let startDate = today;
      let endDate = today;

      // if crossing midnight
      if (next === 0 && endHour === 0) {
        endDate = addDays(today, 1);
      }

      const startISO = `${startDate}T${startSlot}Z`;
      const endISO = `${endDate}T${endSlot}Z`;

      console.log(`Recording cam ${cam} ${slot}`);

      await saveRecording(
        startISO,
        endISO,
        cam,
        startDate,
        slot,
        3600
      );

      if (next === endHour) break;
    }
  }
}

module.exports = { startDailyRecording };