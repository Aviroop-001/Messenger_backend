const express = require("express");
const router = express.Router();
const Agent = require("../models/Agents");
const User = require("../models/Users");

router.post("/login", async (req, res) => {
  const { agentName } = req.body;

  try {
    let agentInteraction = await Agent.findOne({ agentName }).populate(
      "usersAccepted"
    );
    if (!agentInteraction) {
      agentInteraction = await Agent.create({
        agentName,
      });
    }
    res.status(200).json(agentInteraction);
  } catch (error) {
    console.error("Error logging in agent:", error);
    res.status(500).json({ "message": "Internal server error" });
  }
});

router.get("/:agentName", async (req, res) => {
  const { agentName } = req.params;

  try {
    const agentInteraction = await Agent.findOne({
      agentName,
    }).populate("usersAccepted");
    if (!agentInteraction) {
      return res.status(404).json({ message: "Agent not found" });
    }
    res.status(200).json(agentInteraction);
  } catch (error) {
    console.error("Error getting agent details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post('/addUser', async (req, res) => {
  const { userId, agentName } = req.body;

    let user = await User.findOne({ userID: userId });
    user.isAccepted = true;
    await user.save();
  try {
    const agentInteraction = await Agent.findOneAndUpdate(
      { agentName },
      { $addToSet: { usersAccepted: user._id } }, // Use $addToSet to avoid duplicates
      { new: true }
    ).populate("usersAccepted");
    res.status(200).json(agentInteraction);
  } catch (error) {
    console.error('Error adding user to agent:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/removeUser', async (req, res) => {
  const { userId, agentName } = req.body;

    let user = await User.findOne({ userID: userId });
    user.isAccepted = false;
    user.isUrgent = false;
    user.isResolved = true;
    await user.save();
  try {
    const agentInteraction = await Agent.findOneAndUpdate(
      { agentName },
      { $pull: { usersAccepted: user._id } },
      { new: true }
    ).populate("usersAccepted");
    res.status(200).json(agentInteraction);
  } catch (error) {
    console.error('Error removing user from agent:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post("/reply", async (req, res) => {
  const { userId, replyMessage } = req.body;

  try {
    const user = await User.findOne({ userID: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const reply = {
      timestamp: new Date(),
      messageBody: replyMessage,
      isAgentReply: true,
    };
    user.userMessages.push(reply);
    await user.save();
    res.status(200).json({ message: "Reply sent successfully" });
  } catch (error) {
    console.error("Error sending reply:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/search/:searchTerm", async (req, res) => {
  const searchTerm = req.params.searchTerm;

  try {
    const messages = await User.find({
      $or: [
        { "userMessages.messageBody": { $regex: searchTerm, $options: "i" } },
        { userID: { $regex: searchTerm, $options: "i" } },
      ],
    }).populate("userMessages");

    res.json(messages);
  } catch (error) {
    console.error("Error searching messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
