import express from 'express';
import http from 'http';
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




// routes import
import userRouter from './routes/user.routes.js';
import roomRouter from './routes/room.routes.js'

app.use("/api/v1/users", userRouter);
app.use('/api/v1/room', roomRouter);

export const server = http.createServer(app);
export { app }