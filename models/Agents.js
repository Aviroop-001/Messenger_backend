const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema({
  agentName: { type: String, required: true },
  usersAccepted: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isResponding: { type: Boolean, default: false },
  startTime: { type: Date },
});

module.exports = mongoose.model("Agent", agentSchema);
