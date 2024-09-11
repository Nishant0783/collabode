import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Room } from './../models/room.model.js';
import { ApiResponse } from "../utils/ApiResponse.js";

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
    if(!room) {
        throw new ApiError(400, "Room can't be created")
    }

    // 4) Send response to frontend 
    return res
        .status(200)
        .json(
            new ApiResponse(200, room, "Room Created Successfully")
        )
});




export {
    createRoom
}