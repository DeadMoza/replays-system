// cleanup.js (Node 12 / Windows 7 compatible)
const fs = require("fs");
const path = require("path");

const RECORDINGS_DIR = path.join(process.cwd(), "recordings");

function deleteOldFiles(days = 3) {
  const now = Date.now();
  const maxAge = days * 24 * 60 * 60 * 1000;

  const files = fs.readdirSync(RECORDINGS_DIR);

  for (const file of files) {
    const filePath = path.join(RECORDINGS_DIR, file);
    const stat = fs.statSync(filePath);

    if (now - stat.mtimeMs > maxAge) {
      fs.unlinkSync(filePath);
      console.log("Deleted old file:", file);
    }
  }
}

module.exports = { deleteOldFiles };