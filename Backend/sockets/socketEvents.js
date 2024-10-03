import axios from "axios";
import { asyncHandler } from "../utils/asyncHandler.js"
import cookie from 'cookie';
import redis from "../redis/redisClient.js";

export const handleSocketEvents = (io, socket) => {
    socket.on('createRoom', asyncHandler(async ({ roomId, userName }, callback) => {
        const user = socket.user;
        console.log("\n user in socket event is: ", user)
        if (!roomId) {
            socket.emit('error', { message: 'Room ID is required.' });
            return;
        }

        socket.user.username = userName;

        socket.join(roomId);
        io.to(roomId).emit('roomCreated', { userId: user._id, username: userName, roomId });

        console.log(`\n ${userName} created room ${roomId}`)

        try {
            const cookies = cookie.parse(socket.handshake.headers.cookie || '');
            const token = cookies.accessToken;

            console.log("\n Token in socket event: ", token);
            const response = await axios.post(`${process.env.API_BASE_URL}/room/createRoom`, { roomId, username: userName },
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


    socket.on('joinRoom', asyncHandler(async ({ roomId, userName }, callback) => {
        console.log("Join room event is called")
        const user = socket.user;
        console.log("\n User in join room: ", user);

        if (!roomId) {
            socket.emit('error', { message: 'Room ID is required to join a room.' });
            return;
        }

        socket.user.username = userName;

        socket.join(roomId);
        io.to(roomId).emit('userJoined', { userId: user._id, username: userName });

        const roomData = await redis.hget(roomId, 'users');
        let users = JSON.parse(roomData) || [];

        // Add the new user to the users array
        users.push({ userId: user._id, username: userName });

        // Update Redis
        await redis.hset(roomId, 'users', JSON.stringify(users));

        // Emit to all users in the room
        io.to(roomId).emit('roomUsers', users); 
        
        console.log(`${userName} joined room ${roomId}`);

        try {
            const cookies = cookie.parse(socket.handshake.headers.cookie || '');
            const token = cookies.accessToken;

            console.log("\n Token in join room event: ", token);
            const response = await axios.patch(
                `${process.env.API_BASE_URL}/room/joinRoom`,
                { roomId, username: userName },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
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

    socket.on('getRoomUsers', asyncHandler(async ({ roomId }) => {
        if (!roomId) {
            socket.emit('error', { message: "Room ID is required." });
            return;
        }

        // Get users from redis
        const users = await redis.hmget(roomId, 'users');
        if (!users) {
            socket.emit('error', { message: "No users found." });
            return;
        }
        console.log("Users from redis: ", users)

        // Emit users to the client
        socket.emit('roomUsers', JSON.parse(users));
    }));

    socket.on('disconnecting', asyncHandler(async () => {
        console.log("Disconnecting triggered");
        const user = socket.user;

        if (!user || !user._id) {
            console.log("No valid user found during disconnection");
            return;
        }

        console.log(`User ${user.username} is disconnecting`);

        // Getting the room id the user was in (using `disconnecting` ensures the room still exists)
        const roomId = Array.from(socket.rooms)[1]; // 0th index is the socket ID itself
        if (!roomId) {
            console.log("User was not in any room during disconnection");
            return;
        }

        console.log("Room id in disconnection: ", roomId);

        // Fetch current users from Redis
        const roomData = await redis.hget(roomId, 'users');
        let users = JSON.parse(roomData) || [];

        // Remove the disconnected user
        users = users.filter(u => u.userId != user._id);

        // Update the users list in Redis
        await redis.hset(roomId, 'users', JSON.stringify(users));

        // Inform all other users in the room about the disconnection
        io.to(roomId).emit('roomUsers', users);
        io.to(roomId).emit('userLeft', user._id);

        console.log(`User ${user.username} has been removed from room ${roomId}`);
    }));

    socket.on('disconnect', () => {
        console.log("Disconnect event triggered");

        const roomId = Array.from(socket.rooms)[1];
        if (roomId) {
            // Get the updated users from Redis and emit them to all connected clients
            redis.hget(roomId, 'users').then((roomData) => {
                const users = JSON.parse(roomData) || [];
                io.to(roomId).emit('roomUsers', users); // Emit updated user list to Sidebar
                console.log(`Updated user list emitted for room ${roomId}`);
            });
        }
    });


    socket.on('leaveRoom', asyncHandler(async ({ roomId }, callback) => {
        console.log("Leave room called")
        const user = socket.user;
        if (!roomId) {
            socket.emit('error', { message: 'Room ID is required to leave the room.' });
            return;
        }

        console.log(`User ${user.username} is leaving room ${roomId}`);

        // Fetch the current users in the room from Redis
        const roomData = await redis.hget(roomId, 'users');
        let users = JSON.parse(roomData) || [];

        // Remove the user from the users array
        users = users.filter(u => u.userId !== user._id);

        // Update the users list in Redis
        await redis.hset(roomId, 'users', JSON.stringify(users));

        // Notify the remaining users in the room about the updated list
        io.to(roomId).emit('roomUsers', users);
        io.to(roomId).emit('userLeft', user._id);

        // Leave the room
        socket.leave(roomId);
        console.log(`${user.username} left room ${roomId}`);

        // Optionally, disconnect the socket
        callback({ success: true, message: 'Successfully left the room.' });
        socket.disconnect();
        console.log("User left successfully")
    }));
}
