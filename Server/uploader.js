// uploader.js
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const SERVER_UPLOAD_URL = "https://ummahacademy.ly/api/upload";

async function uploadFile(filePath) {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));

  try {
    await axios.post(SERVER_UPLOAD_URL, form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
    });
    console.log("Uploaded:", filePath);
  } catch (err) {
    console.error("Upload failed:", filePath, err.message);
  }
}

module.exports = { uploadFile };