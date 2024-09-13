import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
    withCredentials: true,
    transports: ['websocket']
});

socket.on('connection', () => {
    console.log('Connected to the socket server');
});

socket.on('connect_error', (err) => {
    console.error('Failed to connect to the socket server:', err.message);
});

export default socket;