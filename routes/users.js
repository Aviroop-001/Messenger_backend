const express = require("express");
const router = express.Router();
const User = require("../models/Users");

router.post("/message", async (req, res) => {
  const { userID, messageBody, isUrgent } = req.body;
  try {
    let user = await User.findOne({ userID: userID });
    if (!user) {
      user = new User({
        userID: userID,
        userMessages: [],
      });
    }
    user.userMessages.push({
      timestamp: new Date(),
      messageBody,
    });
    user.isResolved= false;
    user.isUrgent = isUrgent;

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error("Error adding message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/pending", async (req, res) => {
  try {
    const pendingUsers = await User.find({ isAccepted: false }).select("userID");
    const pendingUserIDs = pendingUsers.map((user) => user.userID);
    res.status(200).json(pendingUserIDs);
  } catch (error) {
    console.error("Error fetching pending users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/messages/:userID", async (req, res) => {
  const { userID } = req.params;
  try {
    const user = await User.findOne({ userID: userID });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.userMessages);
  } catch (error) {
    console.error("Error fetching user messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
