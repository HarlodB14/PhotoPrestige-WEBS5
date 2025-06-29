import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {publishToQueue} from "/Utils/rabbitmq.js";

export const register = async (req, res) => {
    try {
        const {username, email, password} = req.body;

        let user = await User.findOne({email});
        if (user) return res.status(400).json({message: "Gebruiker bestaat al!"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({username, email, password: hashedPassword});
        await user.save();

        await publishToQueue('user_registered', {
            event: 'USER_REGISTERED',
            userId: user._id,
            email: user.email,
            username: user.username,
            timestamp: new Date()
        })
        res.status(201).json({message: "Gebruiker succesvol aangemaakt!"});
    } catch (err) {
        res.status(500).json({message: "error aanmaken user: ", error: err.message});
    }
};

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if (!user) return res.status(400).json({message: "Foute gebruikersnaam of wachtwoord"});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({message: "Foute gebruikersnaam of wachtwoord"});

        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: "1h"});

        await publishToQueue('user_logged_in', {
            event: 'USER_LOGGED_IN',
            userId: user._id,
            timestamp: new Date()
        });

        res.json({token, user: {id: user._id, username: user.username, email: user.email}});
    } catch (err) {
        res.status(500).json({message: "error plaatsgevonden met inloggen", error: err.message});
    }
};