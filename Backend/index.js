import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const usersMap = new Map();  // socketId: username
const roomMap = new Map();  // roomId: set of socketId's for that room

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {

    //listening to join room event
    socket.on('joinRoom', ({ username, roomId }) => {
        socket.join(roomId);
        console.log("User ", username, " joined room ", roomId)

        // Mapping socketId to name in usersMap
        usersMap.set(socket.id, username)

        // Checking if roomMap already has the current room or not
        if (!roomMap.has(roomId)) {
            roomMap.set(roomId, new Set())
        }
        // Adding the current socketId to the set of socketId's for the current room in roomMap
        roomMap.get(roomId).add(socket.id)
        console.log("usermap: ", usersMap)
        console.log("roommap: ", roomMap)

        // Emiiting joined user event back to client
        const socketId = socket.id
        socket.emit('joinedUser', ({ username, roomId, socketId }))

        // Broadcast the updated list of users to all clients in the room
        const socketSets = roomMap.get(roomId) || new Set();
        const users = Array.from(socketSets).map(socketId => usersMap.get(socketId));
        io.to(roomId).emit('roomUsers', { clients: users });
    })

    // Listeninig to getUser event to get list of all the connected user in a room
    socket.on('getUser', ({ roomId }) => {
        const socketSets = roomMap.get(roomId) || new Set()
        console.log("Socket sets: ", socketSets)
        const users = Array.from(socketSets).map((socketId) => {
            return usersMap.get(socketId)
        })
        console.log("Users are: ", users)

        // Emitting the user list back to the requesting client
        socket.emit('roomUsers', { clients: users });
    })



})


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("Server is listening on port:", PORT);
});
