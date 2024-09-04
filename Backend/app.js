import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import socketConfig from './config/socketConfig.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({
    limit: '16kb', // Here we are setting the size of data allowed to save on our server.
}));

app.use(express.urlencoded({extended: true, limit: "16kb"}));

app.use(express.static('public'));

app.use(cookieParser());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// Apply socket configuration
socketConfig(io);


// routes import
import userRouter from './routes/user.routes.js';

app.use("/api/v1/users", userRouter);

export { app }