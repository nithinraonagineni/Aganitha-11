// backend/src/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const linksRouter = require("./routes/links");
const Link = require("./models/Link");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// healthcheck
app.get("/healthz", (req, res) => {
  const uptime = process.uptime();
  res.json({
    status: "ok",
    uptime_seconds: Math.floor(uptime),
    timestamp: new Date().toISOString(),
    service: "tinylink-backend",
  });
});

// API
app.use("/api/links", linksRouter);

// Redirect route — must be after API routes
app.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findOne({ code });
    if (!link) return res.status(404).send("Not Found");
    // increment clicks and update lastClicked (non-blocking)
    link.clicks = (link.clicks || 0) + 1;
    link.lastClicked = new Date();
    // save asynchronously (no await to keep redirect fast)
    link.save().catch((err) => console.error("Increment save failed", err));
    return res.redirect(302, link.targetUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// start
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend listening on ${port}`));
