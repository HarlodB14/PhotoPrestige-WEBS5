const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {
        type: String,
        enum: ["deelnemer", "target_eigenaar", "admin"],
        default: "deelnemer"
    },
}, {timestamps: true});

module.exports = mongoose.model("User", UserSchema, "auth_users");