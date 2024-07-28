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
            userName: usersMap[socketId]
        }
    })
}

io.on('connection', ((socket) => {

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

    })


    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms]
        rooms.forEach((roomId) => {
            socket.in(roomId).emit('disconnected', {
                socketId: socket.id,
                userName: usersMap[socket.id]
            })
        })
        usersMap.delete(socket.id);
        socket.leave();
    })

}))



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("Server is listening on port:", PORT);
});
