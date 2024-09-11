import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';

export const verifyJWT = asyncHandler(async(req, res, next) => {
    console.log("Middleware invoked \n")
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        console.log("token is: ", token)
        if(!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        console.log("Got token \n")

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        console.log("User in middleware: ", user)

        if(!user) {
            throw new ApiError(401, "Invalid Access Token");
        }
        
        console.log("got user \n")
        req.user = user
        console.log("req in middleware: ", req)
        next()
    } catch (error) {
        console.log("error in middleware: ", error)
        throw new ApiError(401, "Invalid access token in catch block");
    }
})
