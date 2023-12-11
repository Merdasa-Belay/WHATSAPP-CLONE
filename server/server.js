const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.use(express.json());

const rooms = {};

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", (room) => {
    if (!rooms[room]) {
      rooms[room] = {
        users: [],
        messages: [],
      };
    }

    socket.join(room);
    rooms[room].users.push(socket.id);

    io.to(room).emit("roomData", {
      room,
      messages: rooms[room].messages,
    });
  });

  socket.on("sendMessage", ({ message, roomId }) => {
    rooms[roomId].messages.push(message);
    io.to(roomId).emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT = 3001;

http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
