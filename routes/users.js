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
    const pendingUsers = await User.find({ isAccepted: false });
    res.status(200).json(pendingUsers);
  } catch (error) {
    console.error("Error fetching pending users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:userID", async (req, res) => {
  const { userID } = req.params;
  try {
    let user = await User.findOne({ userID: userID });
    if (!user) {
      user = new User({
        userID: userID,
        userMessages: [],
      });
      await user.save();
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
