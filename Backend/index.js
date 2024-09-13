import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app, server } from './app.js';
import { configureSocket } from './sockets/socketConfig.js';
dotenv.config();

// Initialize socket.io
configureSocket(server);

connectDB()
    .then(() => {
        server.on("error", (error) => {
            console.log("ERR: ", error);
            throw error;
        })
        server.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port: ${process.env.PORT || 8000}`)
        })
    })
    .catch((err) => {
        console.log("Mongo DB connection failed: ", err);
    })