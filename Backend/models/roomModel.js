// Map to store the latest code for each room
const roomCodeMap = new Map();

// Function to get the latest code for a room
export const getLatestCode = (roomId) => {
    return roomCodeMap.get(roomId) || '//some comment'; // Default comment if no code exists
};

// Function to set the latest code for a room
export const setLatestCode = (roomId, code) => {
    roomCodeMap.set(roomId, code);
};

// Function to get all clients in a room
export const getAllClientsInRoom = (io, roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        const socket = io.sockets.sockets.get(socketId);
        return {
            socketId,
            userName: socket?.userName || 'Anonymous' // Provide a default name if userName is undefined
        }
    }).filter(client => client.userName); // Remove any client without a userName
};
