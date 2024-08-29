// controllers/roomController.js

import { getAllClientsInRoom, getLatestCode, setLatestCode } from '../models/roomModel.js'; // Updated imports
import { addUser, removeUser, getUserName } from '../models/userModel.js';

// Join room controller
export const joinRoom = (io, socket, { userName, roomId }) => {
    addUser(socket.id, userName); // Add user when joining the room
    socket.userName = userName; // Set userName directly on the socket object
    socket.join(roomId);

    const clients = getAllClientsInRoom(io, roomId);
    console.log("Clients in roomController: ", clients);

    clients.forEach(({ socketId }) => {
        io.to(socketId).emit('joined', {
            clients,
            userName,
            socketId: socket.id,
        });
    });

    console.log("User joined:", userName, "in room:", roomId);
};

// Check if room exists controller
export const checkRoomExists = (io, { roomId }, callback) => {
    const roomExists = io.sockets.adapter.rooms.has(roomId);
    console.log("Checking if room exists:", roomId, roomExists);
    callback({ exists: roomExists });
};

// Handle code change controller
export const handleCodeChange = (io, socket, { code }) => {
    const rooms = [...socket.rooms];

    if (rooms.length > 1) {
        const roomId = rooms[1];

        // Store code in the room model
        setLatestCode(roomId, code); // Use setLatestCode from roomModel.js

        // Broadcast the code change to others in the room
        socket.to(roomId).emit('codeUpdate', code);
    }
};

// Handle disconnect or leave room controller
export const handleDisconnect = (io, socket) => {
    const rooms = [...socket.rooms];
    if (rooms.length > 1) {
        const roomId = rooms[1];
        const userName = getUserName(socket.id); // Use getUserName function from userModel.js

        // Remove user from the map
        removeUser(socket.id);

        // Leave the room
        socket.leave(roomId);

        // Get updated list of clients
        const updatedClients = getAllClientsInRoom(io, roomId);

        // Notify others in the room
        io.to(roomId).emit('userLeft', {
            socketId: socket.id,
            userName,
            updatedClients
        });

        // Send the latest code to other users if necessary
        const latestCode = getLatestCode(roomId); // Use getLatestCode from roomModel.js
        io.to(socket.id).emit('codeUpdate', latestCode);
    }
};
