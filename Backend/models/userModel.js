const usersMap = new Map();

export const addUser = (socketId, userName) => {
    usersMap.set(socketId, userName); // Use set method of Map
    console.log("User map in userModel: ", userName)
};

export const removeUser = (socketId) => {
    usersMap.delete(socketId); // Use delete method of Map
};

export const getUserName = (socketId) => {
    console.log("Socket id in getUserName in userModel: ", socketId)
    console.log("username is: ", usersMap.get(socketId));
    return usersMap.get(socketId) || 'Anonymous'; // Use get method of Map
};
