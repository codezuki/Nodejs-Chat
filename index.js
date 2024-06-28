const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const port = 3700;

// Serve static files (like chat.js)
app.use(express.static(__dirname + "/public"));

// Set view engine and directory
app.set("views", __dirname + "/views");
app.set("view engine", "jade");
app.engine("jade", require("jade").__express);

// Render the chat page
app.get("/", function (req, res) {
  res.render("page");
});

// Initialize Socket.IO connection handling
io.on("connection", function (socket) {
  console.log("A user connected");

  // Handle user disconnection
  socket.on("disconnect", function () {
    console.log("A user disconnected");
  });

  // Handle new chat message
  socket.on("send", function (data) {
    // Broadcast the message to all users in the same room
    io.to(socket.room).emit("message", { username: socket.username, message: data.message });
  });

  // Handle setting username and joining a room
  socket.on("setUsername", function (username) {
    socket.username = username;
    socket.room = 'mainRoom'; // Use a fixed room for simplicity
    socket.join(socket.room); // Join the main room
    console.log(username + " joined room " + socket.room);
    // Notify user about joining the room
    socket.emit("roomJoined", { room: socket.room });
  });
});

// Start the server
server.listen(port, function () {
  console.log("Node.js listening on port " + port);
});
