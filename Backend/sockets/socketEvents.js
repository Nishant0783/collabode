import axios from "axios";
import { asyncHandler } from "../utils/asyncHandler.js"
import cookie from 'cookie';
import redis from "../redis/redisClient.js";

export const handleSocketEvents = (io, socket) => {
    socket.on('createRoom', asyncHandler(async ({ roomId }, callback) => {
        const user = socket.user;
        console.log("\n user in socket event is: ", user)
        if (!roomId) {
            socket.emit('error', { message: 'Room ID is required.' });
            return;
        }

        socket.join(roomId);
        io.to(roomId).emit('roomCreated', { userId: user._id, username: user.username, roomId });

        console.log(`\n ${user.username} created room ${roomId}`)

        try {
            const cookies = cookie.parse(socket.handshake.headers.cookie || '');
            const token = cookies.accessToken; // Adjust 'accessToken' to match your cookie name

            console.log("\n Token in socket event: ", token);
            const response = await axios.post(`${process.env.API_BASE_URL}/room/createRoom`, { roomId, username: user.username },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // console.log("\n Response of create room: ", response);
            if (response.status === 200) {
                callback({ success: true, message: 'Room created successfully and saved to database \n' })
            }
        } catch (error) {
            console.error("\n Error saving room to the database: ", error);
            callback({ success: false, message: 'Failed to save room to database \n' });
        }
    }));


    socket.on('joinRoom', asyncHandler(async ({ roomId }, callback) => {
        const user = socket.user;
        console.log("\n User in join room: ", user);

        if (!roomId) {
            socket.emit('error', { message: 'Room ID is required to join a room.' });
            return;
        }

        socket.join(roomId);
        io.to(roomId).emit('userJoined', { userId: user._id, username: user.username });

        console.log(`${user.username} joined room ${roomId}`);

        try {
            const response = await axios.patch(
                `${process.env.API_BASE_URL}/room/joinRoom`,
                { roomId, username: user.username },
                {
                    headers: {
                        Authorization: `Bearer ${socket.handshake.auth.token}`,
                    },
                }
            );

            if (response.status === 200) {
                callback({ success: true, message: 'Room joined successfully and saved to the database.' });
            }
        } catch (error) {
            console.error('Error saving joined room to the database:', error.message);
            callback({ success: false, message: 'Failed to save joined room to the database.' });
        }
    }));

    socket.on('getRoomUsers', asyncHandler(async ({roomId}) => {
        if(!roomId) {
            socket.emit('error', { message: "Room ID is required."});
            return;
        }

        // Get users from redis
        const users = await redis.hmget(roomId, 'users');
        if(!users) {
            socket.emit('error', { message: "No users found."});
            return;
        }
        console.log("Users from redis: ", users)

        // Emit users to the client
        socket.emit('roomUsers', JSON.parse(users));
    }));

    socket.on('disconnect', () => {
        console.log(`User ${socket.user.username} disconnected`);
    });
}
