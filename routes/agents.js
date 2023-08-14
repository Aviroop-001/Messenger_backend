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

// Add a user to the usersAccepted array
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

//Remove from selected users
router.post('/removeUser', async (req, res) => {
  const { userId, agentName } = req.body;


    let user = await User.findOne({ userID: userId });
    user.isAccepted = false;
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

// ...


module.exports = router;
