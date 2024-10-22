const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();
const cors = require("cors");

const app = express();

const corsConfig = {
  origin: "https://loca-front-v5.vercel.app",
  credentials: true,
};

app.use(cors(corsConfig));
const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join-order", (orderId) => {
    socket.join(orderId);
    console.log(`Client ${socket.id} joined room: ${orderId}`);
  });

  socket.on("share-location", (data) => {
    const { latitude, longitude, role, orderId } = data;

    io.to(orderId).emit("location-update", { latitude, longitude, role });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
