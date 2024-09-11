import mongoose, { Schema } from "mongoose";

const roomSchema = new Schema(
    {
        roomId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        admin: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        users: [{ type: Schema.Types.ObjectId, ref: 'User'}],
        code: {
            type: String,
            default: ''
        }
    }, 
    {
        timseStamps: true
    }
)

export const Room = mongoose.model("Room", roomSchema)