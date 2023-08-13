const io = require("socket.io-client");

const socket = io.connect("http://localhost:3001"); // Adjust the URL

socket.on("connect", () => {
  console.log("Connected to server");

  // Send a test message every 5 seconds
  setInterval(() => {
    socket.emit("test-message", "Hello from testSocket");
  }, 5000);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
