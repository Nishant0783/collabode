import { handleConnection } from '../services/socketService.js';

const socketConfig = (io) => {
    io.on('connection', (socket) => {
        handleConnection(io, socket);
    });
};

export default socketConfig;
