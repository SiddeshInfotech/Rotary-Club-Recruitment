const socketIO = require("socket.io");

let io;
const activeUsers = new Map(); // userId -> Set of socketIds

const initSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join user-specific room
    socket.on("join", (userId) => {
      if (userId) {
        socket.join(userId);
        if (!activeUsers.has(userId)) {
          activeUsers.set(userId, new Set());
        }
        activeUsers.get(userId).add(socket.id);
        console.log(`User ${userId} joined room. Active connections: ${activeUsers.get(userId).size}`);
        
        // Send list of currently online users to the joining socket
        socket.emit("online_users", Array.from(activeUsers.keys()));

        // Broadcast presence update to everyone
        io.emit("user_status", { userId, status: "online" });
      }
    });

    // Handle typing status
    socket.on("typing", ({ senderId, receiverId, isTyping }) => {
      io.to(receiverId).emit("typing_status", { senderId, isTyping });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
      // Find and remove socketId from activeUsers map
      for (const [userId, socketIds] of activeUsers.entries()) {
        if (socketIds.has(socket.id)) {
          socketIds.delete(socket.id);
          if (socketIds.size === 0) {
            activeUsers.delete(userId);
            // Broadcast user went offline
            io.emit("user_status", { userId, status: "offline" });
            console.log(`User ${userId} went offline`);
          }
          break;
        }
      }
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

// Check if a user is online
const isUserOnline = (userId) => {
  return activeUsers.has(userId.toString());
};

// Emit event to a specific user's room
const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(userId.toString()).emit(event, data);
  }
};

module.exports = {
  initSocket,
  getIO,
  isUserOnline,
  emitToUser,
};
