import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';

export const verifyJWT = asyncHandler(async(req, res, next) => {
    console.log("\n Auth middleware called \n")
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        console.log("\n req cookies in middleware: ", JSON.stringify(req.cookies))
        console.log("\n req header in middleware: ", req.header)
        console.log("\n Token in middleware: ", token,  "\n");

        if(!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if(!user) {
            throw new ApiError(401, "Invalid Access Token");
        }
        
        req.user = user;
        next()
    } catch (error) {
        console.log("error in middleware: ", error)
        throw new ApiError(401, "Invalid access token in catch block");
    }
})
