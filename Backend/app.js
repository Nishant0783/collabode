import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import socketConfig from './config/socketConfig.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// Apply socket configuration
socketConfig(io);

export { app }