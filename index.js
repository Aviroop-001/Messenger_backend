const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const http = require("http");
const messagesRouter = require("./routes/messages");
const agentRouter = require("./routes/agents");
const userRouter = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 3001;

dotenv.config();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGODB_CONNECT)
  .then(console.log("Connected to MongoDB"))
  .catch((err) => {
    console.log(err);
  });


  // app.use((req, res, next) => {
  //   res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // Replace with your frontend's origin
  //   res.header("Access-Control-Allow-Credentials", true);
  //   next();
  // });

  app.use("/api/messages", messagesRouter);
  app.use('/api/agents', agentRouter)
  app.use("/api/users", userRouter);

  app.get("/", (req, res) => {
    try {
      res.send("Server is running");
    } catch (error) {
      res.status(404).json("Server is DOWN");
    }
  });

app.listen(PORT, () => {
  console.log("Backend is up and running...");
});

// const io = require("socket.io")(server, {
//   // pingTimeout: 20000,
//   cors: {
//     origin: "*",
//   },
// });

// io.on("connection", (socket) => {
//   console.log("A user connected");

//   socket.on("join-room", (roomId) => {
//     socket.join(roomId);
//     console.log(`User joined room: ${roomId}`);
//   });

//   socket.on("disconnect", () => {
//     socket.leaveAll(); // Leave all rooms
//     console.log("A user disconnected");
//   });

//   socket.on("admin-reply-start", (roomId) => {
//     socket.to(roomId).emit("admin-reply-start");
//   });

//   socket.on("admin-reply-end", (roomId) => {
//     socket.to(roomId).emit("admin-reply-end");
//   });
// });
