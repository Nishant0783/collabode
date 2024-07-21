import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const usersMap = new Map();

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    socket.on('joinRoom', ({ name, roomId }) => {
        console.log("Received joinRoom event with name:", name, "and roomId:", roomId);

        // Join the room and add user to the map
        socket.join(roomId);
        usersMap.set(socket.id, name);

        // Emit updated list of users to everyone in the room
        const users = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        const names = users.map((socketId) => usersMap.get(socketId));
        io.to(roomId).emit('roomUsers', names);

        // Log the current usersMap
        console.log("Updated usersMap after joinRoom:", usersMap);
    });

    socket.on('editorUpdate', ({ roomId, value }) => {
        console.log(`Update in room ${roomId}:`, value);
        socket.to(roomId).emit('editorUpdate', value);
    });

    socket.on('getUser', ({ roomId }) => {
        const users = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        const names = users.map((socketId) => usersMap.get(socketId));
        console.log("Names in room", roomId, "are:", names);
        socket.emit('roomUsers', names);
    });

    socket.on('disconnect', () => {
        usersMap.delete(socket.id);
        console.log("A user disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("Server is listening on port:", PORT);
});
