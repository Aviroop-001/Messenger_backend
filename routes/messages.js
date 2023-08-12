const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

router.get("/", async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//GET all users
router.get("/userIds", async (req, res) => {
  try {
    const uniqueUserIds = await Message.distinct("userId");
    res.json(uniqueUserIds);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET all messages by particular users
router.get("/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const messages = await Message.find({ userId }).sort({ timestamp: "asc" });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const { userId, timestamp, messageBody } = req.body;
  try {
    const newMessage = new Message({
      userId,
      timestamp,
      messageBody,
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
