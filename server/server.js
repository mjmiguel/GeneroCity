const express = require('express');
const path = require('path');
const itemRouter = require('./routes/itemsRouter.js');
const userRouter = require('./routes/userRouter.js');
const cookieParser = require('cookie-parser');
const http = require('http');
const socket = require('socket.io');
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

// require dotenv to hide server uri
require('dotenv').config();

const app = express();
const PORT = 3000;
const server = http.createServer(app);
const io = socket(server);

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

// Handle Parsing of Request Body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const botName = "Generosity Bot";
/**
 * 
 * 
 */
// Run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

// Handle Requests for Static Files
app.use('/', express.static(path.resolve(__dirname, '../')));

// Define Route Handlers
app.use('/item', itemRouter);
app.use('/user', userRouter);
// app.use('/filter', filterRouter); **Bypassed by migrating filter functionality to frontend

// Get Home Route
app.get('/', (req, res) => res.status(200).sendFile(path.resolve(__dirname, '../index.html')));

app.get('/profile', (req, res) => res.sendFile(path.resolve(__dirname, '../index.html')));
app.get('/login', (req, res) => res.sendFile(path.resolve(__dirname, '../index.html')));
app.get('/signup', (req, res) => res.sendFile(path.resolve(__dirname, '../index.html')));
app.get('/chat', (req, res) => res.sendFile(path.resolve(__dirname, '../index.html')));
app.get('/messages', (req, res) => res.sendFile(path.resolve(__dirname, '../index.html')));

app.get('/landing', (req, res) => res.sendFile(path.resolve(__dirname, '../index.html')));

// Catch-All to handle unknown routes
app.use('*', (req, res) => {
  res.status(404).send('Bad Request');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.log('Global error handler: ', err);
  res.status(500).send(err);
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
// Start Server
// app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
