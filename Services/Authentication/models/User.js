import { Roles } from "./Enums/Roles.js";
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        required: true,
        enum: Object.values(Roles),
        default: Roles.Participant,
    },
}, { timestamps: true });

export default mongoose.model("User", UserSchema, "auth_users");