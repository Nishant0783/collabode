import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';


// #GENERATE ACCESS AND REFRESH TOKEN
const generateRefreshAndAccessToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        console.log("Refresh token generated: ", refreshToken, " \n")
        console.log("Access token generated: ", accessToken, " \n")

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };   
    } catch (error) {
        console.error("Error in generating refresh and access token: ", error)
        throw new ApiError(500, "Internal Sever Error");
    }
}

// #REGISTER USER
const registerUser = asyncHandler(async (req, res) => {
    // 1) Get all the details from req.body
    const { username, name, emailId, password } = req.body;
    console.log(req.body)

    // 2) Check if any field is empty
    if (
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

    if (existedUser) {
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
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user.");
    }

    // 6) Sending createdUser to frontend as a response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User created Successfully")
    )
})


// #LOGIN USER
const loginUser = asyncHandler(async (req, res) => {
    // 1) Get details from frontend
    const { username, password } = req.body;
    console.log(req.body);

    // 2) Find user in DB
    const user = await User.findOne({ username: username });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // 3) Validate Password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    // 4) Generate Access and refresh token
    const { refreshToken, accessToken } = await generateRefreshAndAccessToken(user._id);

    // 5) Prepare response to save in cookies and send to frontend
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken -email");

    // 6) Save data to cookies
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }

    // 7) Response
    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged in successfully"
            )
        )
})



// #LOGOUT
const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User logged out successfully")
        )
})

// #REFRESH ACCESS TOKEN
const refreshAccessToken = asyncHandler(async (req, res) => {
    // 1) Get the refresh token which is with user
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    // console.log("body token: ", req.body.refreshToken)

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized Request");
    }

    try {
        // 2) Decode the token to get the details (userId) stored in token
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        // 3) Get the userId and find it in DB
        const user = await User.findById(decodedToken?._id).select("-password");
        if (!user) {
            throw new ApiError(402, "Invalid refresh token")
        }

        // 4) Match the refresh token stored in db to the token we got from user
        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(403, "Refresh token is expired or used")
        }

        // 5) Generate new access token and for safety purpose generate new refresh token also
        const { accessToken, refreshToken: newRefreshToken } = await generateRefreshAndAccessToken(user._id);

        // 6) send generated access token in cookies
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        }

        return res
            .status(201)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { user, accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed successfully"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
})




export {
    registerUser,
    loginUser,
    logout,
    refreshAccessToken
}