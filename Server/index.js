// recorder.js (Node 12 / Windows 7 compatible)
require("dotenv").config();
const cron = require("node-cron");
const { startDailyRecording } = require("./scheduler");
const { deleteOldFiles } = require("./cleanup");

console.log("Recorder service started");

// Run immediately once
(async () => {
  try {
    console.log("Starting immediate recording job");
    await startDailyRecording(17, 0); // downloads today's recordings from 5 PM onwards
    deleteOldFiles(3);
    console.log("Immediate recording finished");
  } catch (err) {
    console.error("Immediate recording failed:", err);
  }
})();

// Schedule daily at 7 PM
cron.schedule("0 19 * * *", async () => {
  console.log("Starting daily scheduled recording job at 7 PM");
  try {
    await startDailyRecording(17, 0); // downloads from 5 PM to midnight
    deleteOldFiles(3);
    console.log("Scheduled recording finished");
  } catch (err) {
    console.error("Scheduled recording failed:", err);
  }
});