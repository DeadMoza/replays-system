import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 5000;

const RECORDINGS_DIR = "/var/www/reciver/recordings";

// create folder if it doesn't exist
if (!fs.existsSync(RECORDINGS_DIR)) {
  fs.mkdirSync(RECORDINGS_DIR);
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, RECORDINGS_DIR);
  },
filename: (req, file, cb) => {
  cb(null, file.originalname);
}
});

const upload = multer({ storage });

// upload endpoint
app.post("/api/upload", upload.single("file"), (req, res) => {
  console.log("Received file:", req.file.filename);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// -------------------------
// AUTO DELETE OLD FILES
// -------------------------

function cleanupOldFiles() {

  const files = fs.readdirSync(RECORDINGS_DIR);
  const now = Date.now();

  files.forEach(file => {

    const filePath = path.join(RECORDINGS_DIR, file);
    const stats = fs.statSync(filePath);

    const age = now - stats.mtimeMs;

    const threeDays = 3 * 24 * 60 * 60 * 1000;

    if (age > threeDays) {
      fs.unlinkSync(filePath);
      console.log("Deleted old file:", file);
    }

  });
}

// run every hour
setInterval(cleanupOldFiles, 60 * 60 * 1000);

// run once at startup
cleanupOldFiles();