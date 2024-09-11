import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Room } from './../models/room.model.js';
import { ApiResponse } from "../utils/ApiResponse.js";

// LOGIN USER
const createRoom = asyncHandler(async (req, res) => {
    // 1) Get roomId and username from frontend
    const { username, roomId } = req.body;
    if (!username || !roomId) {
        throw new ApiError(400, "All fields are required");
    }

    // 2) Get the userId from req.user
    const userId = req.user?._id;
    console.log("userID is: ", userId)
    if (!userId) {
        throw new ApiError(401, "Unauthorized, try loging in again")
    }

    // 3) create a new room with all the neccessary details
    const room = await Room.create({
        roomId,
        admin: new mongoose.Types.ObjectId(userId),
    })
    if (!room) {
        throw new ApiError(400, "Room can't be created")
    }

    // 4) Send response to frontend 
    return res
        .status(200)
        .json(
            new ApiResponse(200, room, "Room Created Successfully")
        )
});


// JOIN ROOM
const joinRoom = asyncHandler(async (req, res) => {
    // 1) Get username and roomId from frontend
    const { username, roomId } = req.body;
    if (!username || !roomId) {
        throw new ApiError(400, "All fields are required")
    }

    const room = await Room.find({ roomId: roomId })
    if (!room) {
        throw new ApiError(404, "Room not found")
    }

    // 2) Get userId from req.user
    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(401, "unauthorized, try loging in again")
    }

    // 3) Update room model with users
    const updatedRoom = await Room.findOneAndUpdate({ roomId: roomId },
        {
            $push: { users: new mongoose.Types.ObjectId(userId) }
        },
        {
            new: true // returns updated document
        }

    )
    if (!updatedRoom) {
        throw new ApiError(400, "Error in joining room")
    }

    // 4) Send updated room as response
    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedRoom, "Room joined successfully")
        )
})




export {
    createRoom,
    joinRoom
}