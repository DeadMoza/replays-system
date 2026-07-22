// nvrClient.js (Node 12 / Windows 7 / CommonJS compatible)
const crypto = require("crypto");
const xml2js = require("xml2js");
const http = require("http");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const ffmpegBin = require("ffmpeg-static");
const { uploadFile } = require("../uploader");

const parser = new xml2js.Parser();

const NVR_IP = process.env.NVR_IP;
const NVR_PORT = process.env.NVR_PORT ? Number(process.env.NVR_PORT) : 80;
const NVR_USER = process.env.NVR_USER;
const NVR_PASS = process.env.NVR_PASS;

const RECORDINGS_DIR = path.join(process.cwd(), "recordings");
try {
  fs.mkdirSync(RECORDINGS_DIR, { recursive: true });
} catch (e) {
  console.log("Recordings folder exists or error:", e.message);
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(function (resolve) { setTimeout(resolve, ms); });
}

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16).toUpperCase();
  });
}

function addMinutes(isoString, minutes) {
  var d = new Date(isoString);
  d.setMinutes(d.getMinutes() + minutes);
  return d.toISOString().replace(/\.\d{3}Z$/, "Z");
}

// Convert "2026-03-12T19:00:00Z" → "20260312T190000Z"
function isoToRTSPTime(isoString) {
  return isoString.replace(/-/g, "").replace(/:/g, "").replace(".", "");
}

// ─── Raw HTTP ──────────────────────────────────────────────────────────────

function httpRequest(options, body) {
  return new Promise(function (resolve, reject) {
    var req = http.request(options, function (res) {
      var chunks = [];
      res.on("data", function (chunk) { chunks.push(chunk); });
      res.on("end", function () {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(chunks).toString("utf8"),
        });
      });
    });
    req.on("error", reject);
    req.end(body || null);
  });
}

// ─── Digest Auth ───────────────────────────────────────────────────────────

function parseDigestChallenge(header) {
  var obj = {};
  var str = header.replace(/^Digest\s+/i, "");
  var parts = [];
  var current = "";
  var inQuote = false;
  for (var i = 0; i < str.length; i++) {
    var c = str[i];
    if (c === '"') {
      inQuote = !inQuote;
      current += c;
    } else if (c === "," && !inQuote) {
      parts.push(current.trim());
      current = "";
    } else {
      current += c;
    }
  }
  if (current.trim()) parts.push(current.trim());

  parts.forEach(function (part) {
    var eqIdx = part.indexOf("=");
    if (eqIdx === -1) return;
    var key = part.slice(0, eqIdx).trim();
    var val = part.slice(eqIdx + 1).trim();
    if (val[0] === '"' && val[val.length - 1] === '"') {
      val = val.slice(1, -1);
    }
    obj[key] = val;
  });

  return obj;
}

function md5(str) {
  return crypto.createHash("md5").update(str).digest("hex");
}

function buildAuthHeader(challenge, method, uriPath) {
  var realm  = challenge.realm  || "";
  var nonce  = challenge.nonce  || "";
  var qop    = challenge.qop    || "";
  var opaque = challenge.opaque || "";

  qop = qop.replace(/^"(.*)"$/, "$1").trim();

  var ha1 = md5(NVR_USER + ":" + realm + ":" + NVR_PASS);
  var ha2 = md5(method + ":" + uriPath);

  var response;
  var header;
  var qopList = qop.split(",").map(function (s) { return s.trim(); });

  if (qop && qopList.indexOf("auth") !== -1) {
    var nc     = "00000001";
    var cnonce = crypto.randomBytes(8).toString("hex");
    response = md5(ha1 + ":" + nonce + ":" + nc + ":" + cnonce + ":auth:" + ha2);
    header =
      'Digest username="' + NVR_USER + '"' +
      ', realm="' + realm + '"' +
      ', nonce="' + nonce + '"' +
      ', uri="' + uriPath + '"' +
      ', qop=auth' +
      ', nc=' + nc +
      ', cnonce="' + cnonce + '"' +
      ', response="' + response + '"' +
      (opaque ? ', opaque="' + opaque + '"' : "");
  } else {
    response = md5(ha1 + ":" + nonce + ":" + ha2);
    header =
      'Digest username="' + NVR_USER + '"' +
      ', realm="' + realm + '"' +
      ', nonce="' + nonce + '"' +
      ', uri="' + uriPath + '"' +
      ', response="' + response + '"' +
      (opaque ? ', opaque="' + opaque + '"' : "");
  }

  return header;
}

async function digestRequest(uriPath, method, body, contentType) {
  var probeOptions = {
    hostname: NVR_IP,
    port: NVR_PORT,
    path: uriPath,
    method: "GET",
    headers: {
      "Connection": "close",
      "Content-Length": 0,
    },
  };

  var probe = await httpRequest(probeOptions, null);

  if (probe.statusCode !== 401) {
    throw new Error("Expected 401 from NVR, got: " + probe.statusCode);
  }

  var wwwAuth = probe.headers["www-authenticate"] || "";
  if (!wwwAuth.toLowerCase().startsWith("digest")) {
    throw new Error("NVR is not using Digest auth: " + wwwAuth);
  }

  var challenge = parseDigestChallenge(wwwAuth);
  var authHeader = buildAuthHeader(challenge, method, uriPath);

  await sleep(300);

  var bodyBuffer = Buffer.from(body, "utf8");

  var requestOptions = {
    hostname: NVR_IP,
    port: NVR_PORT,
    path: uriPath,
    method: method,
    headers: {
      "Authorization": authHeader,
      "Content-Type": contentType || "application/xml",
      "Content-Length": bodyBuffer.length,
      "Connection": "close",
    },
  };

  var result = await httpRequest(requestOptions, bodyBuffer);
  return result;
}

// ─── NVR Search ────────────────────────────────────────────────────────────

async function searchRecording(start, end, channel) {
  var searchID = generateUUID();

  var xml =
    '<CMSearchDescription>' +
      '<searchID>' + searchID + '</searchID>' +
      '<trackList><trackID>' + channel + '</trackID></trackList>' +
      '<timeSpanList><timeSpan>' +
        '<startTime>' + start + '</startTime>' +
        '<endTime>' + end + '</endTime>' +
      '</timeSpan></timeSpanList>' +
      '<maxResults>100</maxResults>' +
      '<searchResultPostion>0</searchResultPostion>' +
      '<metadataList>' +
        '<metadataDescriptor>//recordType.meta.std-cgi.com</metadataDescriptor>' +
      '</metadataList>' +
    '</CMSearchDescription>';

  console.log("Sending XML:", xml);

  var res = await digestRequest("/ISAPI/ContentMgmt/search", "POST", xml, "application/xml");
  console.log("NVR response:", res.body);

  if (res.body.indexOf("badXmlContent") !== -1 || res.body.indexOf("Invalid XML") !== -1) {
    console.log("No recordings for this time range.");
    return null;
  }

  return parser.parseStringPromise(res.body);
}

// ─── RTSP Download ─────────────────────────────────────────────────────────

function downloadSegmentToFile(rtspUrl, outFile, durationSeconds) {
  return new Promise(function (resolve, reject) {
    var ffmpegArgs = [
      "-y",
      "-rtsp_transport", "tcp",
      "-i", rtspUrl,
      "-t", durationSeconds.toString(),
      "-c:v", "copy",
      "-c:a", "aac",
      outFile,
    ];

    console.log("FFmpeg recording", durationSeconds, "seconds to:", outFile);

    var proc = spawn(ffmpegBin, ffmpegArgs);

    proc.stderr.on("data", function (data) {
      var msg = data.toString();
      if (
        msg.indexOf("Error") !== -1 ||
        msg.indexOf("error") !== -1 ||
        msg.indexOf("Output #0") !== -1 ||
        msg.indexOf("video:") !== -1 ||
        msg.indexOf("frame=") !== -1
      ) {
        console.log("ffmpeg:", msg.trim());
      }
    });

    proc.on("close", function (code) {
      if (code === 0) resolve(outFile);
      else reject(new Error("FFmpeg exited with code " + code));
    });

    proc.on("error", reject);
  });
}

// ─── Main Entry ────────────────────────────────────────────────────────────

async function saveRecording(startISO, endISO, channel, date, slot, durationSeconds) {
  var shiftedStart = addMinutes(startISO, 30);
  var shiftedEnd   = addMinutes(endISO, 30);

  console.log("Searching between:", shiftedStart, "and", shiftedEnd);

  var result = await searchRecording(shiftedStart, shiftedEnd, channel);
  if (!result) return [];

  var matchList = result && result.CMSearchResult && result.CMSearchResult.matchList && result.CMSearchResult.matchList[0];
  var files = matchList && matchList.searchMatchItem;

  if (!files) {
    console.log("No recordings found for slot:", slot);
    return [];
  }

  if (!Array.isArray(files)) files = [files];
  if (files.length === 0) return [];

  var safeSlot = slot.replace(/:/g, "-");
  var savedFiles = [];

  // Build exact RTSP window: slot start → slot start + 90min
  // NVR seeks internally to starttime, so timestamps will be correct
  var rtspStart = isoToRTSPTime(startISO);
  var rtspEnd   = isoToRTSPTime(addMinutes(startISO, 90));

  for (var i = 0; i < files.length; i++) {
    var f = files[i];
    var uri = f.mediaSegmentDescriptor[0].playbackURI[0].replace(/&amp;/g, "&");

    // Replace starttime/endtime so NVR seeks to exact slot start
    uri = uri.replace(/starttime=[^&]+/, "starttime=" + rtspStart);
    uri = uri.replace(/endtime=[^&]+/,   "endtime="   + rtspEnd);

    var rtspAuth = encodeURIComponent(NVR_USER) + ":" + encodeURIComponent(NVR_PASS);
    var rtspUrl = uri.replace(
      "rtsp://" + NVR_IP,
      "rtsp://" + rtspAuth + "@" + NVR_IP
    );

    var fileName = "cam" + channel + "-" + date + "-" + safeSlot + "-part1.mp4";
    var filePath = path.join(RECORDINGS_DIR, fileName);

    if (fs.existsSync(filePath)) {
      console.log("Already downloaded, skipping:", fileName);
      continue;
    }

    console.log("Segment URL:", rtspUrl);
    console.log("Downloading to:", filePath);

    await downloadSegmentToFile(rtspUrl, filePath, durationSeconds);
    console.log("Download complete, uploading...");
    await uploadFile(filePath);
    savedFiles.push(filePath);
    break;
  }

  return savedFiles;
}

module.exports = { searchRecording, saveRecording };