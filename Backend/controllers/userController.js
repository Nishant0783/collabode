const usersMap = new Map(); // Keeping this internal to the module

export const addUser = (socketId, userName) => {
    usersMap[socketId] = userName;
    console.log("User added:", socketId, userName);
    console.log("User map afetr user add in userController: ", usersMap)
};

export const removeUser = (socketId) => {
    delete usersMap[socketId];
    console.log("User removed:", socketId);
};
