import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Room } from './../models/room.model.js';
import { ApiResponse } from "../utils/ApiResponse.js";
import redis from "../redis/redisClient.js";

// CREATE ROOM
const createRoom = asyncHandler(async (req, res) => {
    // 1) Get roomId and username from frontend
    console.log('\n create room called \n');
    const { username, roomId } = req.body;
    if (!username || !roomId) {
        throw new ApiError(400, "All fields are required");
    }

    // 2) Get the userId from req.  
    const userId = req.user?._id;
    console.log("\nuserID in room controller is: ", userId)
    if (!userId) {
        throw new ApiError(401, "Unauthorized, try loging in again")
    }

    // 3) Check if room already exists in redis
    const roomExists = await redis.exists(roomId);
    console.log("Room exists: ", roomExists);
    if (roomExists == 1) {
        throw new ApiError(400, "Room already exists");
    }

    // 4) Create a room schema in redis
    await redis.hmset(roomId, {
        admin: JSON.stringify({
            userId,
            username
        }),
        users: JSON.stringify([{ userId, username }])
    })

    // 5) create a new room with all the neccessary details
    const room = await Room.create({
        roomId,
        admin: new mongoose.Types.ObjectId(userId),
    })
    if (!room) {
        throw new ApiError(400, "Room can't be created")
    }

    // 6) Send response to frontend 
    return res
        .status(200)
        .json(
            new ApiResponse(200, room, "Room Created Successfully")
        )
});


// JOIN ROOM
const joinRoom = asyncHandler(async (req, res) => {
    console.log("Join room controller called.")
    // 1) Get username and roomId from frontend
    const { username, roomId } = req.body;
    if (!username || !roomId) {
        throw new ApiError(400, "All fields are required");
    }

    const room = await Room.findOne({ roomId });
    if (!room) {
        throw new ApiError(404, "Room not found");
    }

    // 2) Get userId from req.user
    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(401, "Unauthorized, try logging in again");
    }

    // 3) Update room model with users after a delay (optional)
    setTimeout(async () => {
        try {
            // Get the latest users from Redis
            const updatedUsersData = await redis.hget(roomId, 'users');
            const updatedUsers = JSON.parse(updatedUsersData);

            // Save the users to the room in the database
            const updatedRoom = await Room.findOneAndUpdate(
                {
                    roomId: roomId
                },
                {
                    $addToSet: {
                        users: {
                            $each: updatedUsers.map(u => new mongoose.Types.ObjectId(u.userId))
                        }
                    }
                },
                {
                    new: true // Return the updated room document
                }
            );

            if (!updatedRoom) {
                console.log("Error in updating users: ", roomId);
                throw new ApiError(500, "Error in updating users");
            } else {
                console.log("Users saved successfully: ", roomId);
            }
        } catch (error) {
            console.error("Error inside setTimeout:", error);
        }
    }, 10000); // Delay of 10 seconds before saving users to the database


    const updatedRoom = await redis.hgetall(roomId);
    // 5) Send response immediately after joining the room, without waiting for the database update
    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedRoom, "Room joined successfully")
        );
});

export {
    createRoom,
    joinRoom
}

