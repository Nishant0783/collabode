import { joinRoom, checkRoomExists, handleCodeChange, handleDisconnect } from '../controllers/roomController.js';

export const handleConnection = (io, socket) => {
    console.log('New socket connection:', socket.id); // Check if this logs twice

    // Remove any existing listeners to avoid duplication
    socket.removeAllListeners();

    socket.on('checkRoom', (data, callback) => {
        checkRoomExists(io, data, callback);
    });

    socket.on('join', (data) => {
        joinRoom(io, socket, data);
    });

    socket.on('codeChange', (data) => {
        handleCodeChange(io, socket, data);
    });

    const disconnectHandler = () => {
        handleDisconnect(io, socket);
    };

    socket.on('leaveRoom', disconnectHandler);
    socket.on('disconnect', disconnectHandler);
};
