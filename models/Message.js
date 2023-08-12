const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  userId: Number,
  timestamp: Date,
  messageBody: String,
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
