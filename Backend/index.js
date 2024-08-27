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

const getAllClientsInRoom = (roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            userName: usersMap[socketId] || 'Anonymous' // Provide a default name if userName is undefined
        }
    }).filter(client => client.userName) // Remove any client without a userName
}

io.on('connection', ((socket) => {

    // Event to check if a room exists
    socket.on('checkRoom', ({ roomId }, callback) => {
        const roomExists = io.sockets.adapter.rooms.has(roomId);
        console.log("Map is on checking: ", usersMap);
        callback({ exists: roomExists });
    });


    // join event
    socket.on('join', ({ userName, roomId }) => {

        // Add user to map
        usersMap[socket.id] = userName;

        // Actually joining user to the room
        socket.join(roomId)

        const clients = getAllClientsInRoom(roomId)
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit('joined', {
                clients,
                userName,
                socketId: socket.id
            })
        })

        console.log("Map is on join: ", usersMap);

    })

    // Handle user disconnection
    const handleDisconnect = () => {
        const rooms = [...socket.rooms];
        if (rooms.length > 1) {
            const roomId = rooms[1];
            const userName = usersMap[socket.id];

            // Remove user from the map
            delete usersMap[socket.id];

            // Leave the room
            socket.leave(roomId);

            // Get updated clients list
            const updatedClients = getAllClientsInRoom(roomId);

            // Notify other clients in the room with the updated list
            io.to(roomId).emit('userLeft', {
                socketId: socket.id,
                userName: userName,
                updatedClients: updatedClients
            });
        }
    }

    socket.on('leaveRoom', handleDisconnect);
    socket.on('disconnect', handleDisconnect);
}))



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("Server is listening on port:", PORT);
});
