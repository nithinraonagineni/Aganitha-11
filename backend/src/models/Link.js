// backend/src/models/Link.js
const mongoose = require("mongoose");

const LinkSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    match: /^[A-Za-z0-9]{6,8}$/,
  },
  targetUrl: { type: String, required: true },
  clicks: { type: Number, default: 0 },
  lastClicked: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

LinkSchema.index({ code: 1 }, { unique: true });

module.exports = mongoose.model("Link", LinkSchema);
