import { Server } from "socket.io";
import { ApiError } from "../utils/ApiError.js";
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { handleSocketEvents } from './socketEvents.js';

export const configureSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN,
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.use((socket, next) => {
        const cookies = cookie.parse(socket.handshake.headers.cookie || '');
        const token = cookies.accessToken; // Adjust 'accessToken' to match your cookie name

        console.log("\n Token in socket config: ", token);

        if (!token) {
            return next(new ApiError(401, "Authentication Error: No token provided"));
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return next(new ApiError(404, "Authentication Error: Invalid Token"));
            }
            socket.user = decoded;
            next();
        });
    });

    io.on('connection', (socket) => {
        handleSocketEvents(io, socket);
    });

    return io;
};
