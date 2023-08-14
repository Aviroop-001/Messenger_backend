const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userID: {
    type: String,
    unique: true,
  },
  userMessages: [
    {
      timestamp: {
        type: Date,
      },
      messageBody: {
        type: String,
      },
      isAgentReply: {
        type: Boolean,
        default: false,
      },
    },
  ],
  isAccepted: {
    type: Boolean,
    default: false,
  },
  isResolved: {
    type: Boolean,
    default: false,
  },
  isUrgent: {
    type: Boolean,
    default: false,
  },
  description: { type: String },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
