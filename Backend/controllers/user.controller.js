import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js'

const registerUser = asyncHandler(async (req, res) => {
    // 1) Get all the details from req.body
    const { username, name, emailId, password } = req.body;
    console.log(req.body)

    // 2) Check if any field is empty
    if(
        [username, name, emailId, password].some((field) => (
            field.trim() === ""
        ))
    ) {
        throw new ApiError(400, "All fields are required.");
    }

    // 3) Checking if any user with same email or username exists or not
    const existedUser = await User.findOne({
        $or: [{ username, emailId }]
    })

    if(existedUser) {
        throw new ApiError(409, "User with email or username already exists.");
    }

    // 4) Create new user
    const user = await User.create({
        username: username.toLowerCase(),
        name,
        emailId, 
        password
    })

    // 5) Checking user creation and mpodifying response
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user.");
    }

    // 6) Sending createdUser to frontend as a response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User created Successfully")
    )
})

export {
    registerUser
}