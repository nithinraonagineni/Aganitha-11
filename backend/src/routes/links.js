// backend/src/routes/links.js
const express = require("express");
const router = express.Router();
const Link = require("../models/Link");
const validator = require("validator");

// helper to generate random code
function genCode(len = 7) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < len; i++)
    out += chars.charAt(Math.floor(Math.random() * chars.length));
  return out;
}

async function makeUniqueCode() {
  for (let i = 0; i < 5; i++) {
    const len = 6 + Math.floor(Math.random() * 3); // 6..8
    const code = genCode(len);
    const exists = await Link.findOne({ code });
    if (!exists) return code;
  }
  // fallback longer code
  return genCode(8) + Date.now().toString(36).slice(-3);
}

// POST /api/links
// body: { targetUrl, code (optional) }
router.post("/", async (req, res) => {
  try {
    const { targetUrl, code } = req.body;
    if (!targetUrl || !validator.isURL(targetUrl, { require_protocol: true })) {
      return res
        .status(400)
        .json({
          error: "Invalid or missing targetUrl. Include protocol (https://).",
        });
    }

    let finalCode = code ? String(code).trim() : null;
    if (finalCode) {
      if (!/^[A-Za-z0-9]{6,8}$/.test(finalCode)) {
        return res
          .status(400)
          .json({ error: "Custom code must match [A-Za-z0-9]{6,8}." });
      }
      const existing = await Link.findOne({ code: finalCode });
      if (existing)
        return res.status(409).json({ error: "Code already exists." });
    } else {
      finalCode = await makeUniqueCode();
    }

    const created = await Link.create({ code: finalCode, targetUrl });
    return res.status(201).json({
      code: created.code,
      targetUrl: created.targetUrl,
      clicks: created.clicks,
      lastClicked: created.lastClicked,
      createdAt: created.createdAt,
    });
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ error: "Code already exists." });
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

// GET /api/links
router.get("/", async (req, res) => {
  try {
    const links = await Link.find().sort({ createdAt: -1 }).lean();
    const rows = links.map((l) => ({
      code: l.code,
      targetUrl: l.targetUrl,
      clicks: l.clicks,
      lastClicked: l.lastClicked,
      createdAt: l.createdAt,
    }));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/links/:code  (stats)
router.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findOne({ code }).lean();
    if (!link) return res.status(404).json({ error: "Not found" });
    res.json({
      code: link.code,
      targetUrl: link.targetUrl,
      clicks: link.clicks,
      lastClicked: link.lastClicked,
      createdAt: link.createdAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/links/:code
router.delete("/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const deleted = await Link.findOneAndDelete({ code });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
