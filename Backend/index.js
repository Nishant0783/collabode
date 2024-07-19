import express from 'express'
import http from 'http'
import { Server } from 'socket.io'


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log("A user connected: ", socket.io)
    socket.on('joinRoom', ({ name, roomId }) => {
        console.log(name, " ", roomId, " recieved at backend")
        socket.join(roomId)
        console.log(name, " joined the room: ", roomId)
    });

    socket.on('disconnect', () => {
        console.log("A user disconnected: ", socket.id)
    })
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("Server is listening on port: ", PORT)
})