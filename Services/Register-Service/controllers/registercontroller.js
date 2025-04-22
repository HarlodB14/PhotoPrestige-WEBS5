import Registration from '../models/Registration.js';
import {Roles} from "../../Authentication/models/Enums/Roles.js";

export const register = async (req, res) => {
    try {
        const {event} = req.body;
        const {id, role} = req.user;

        if (![Roles.Participant, Roles.TargetOwner].includes(role)) {
            return res.status(403).json({message: "Geen rechten om te registreren voor dit event. " + role});
        }

        const alreadyRegistered = await Registration.findOne({event, userId: id});
        if (alreadyRegistered) {
            return res.status(400).json({message: "U bent al aangemeld voor dit event!"});
        }

        const registration = new Registration({event, userId: id, role});
        await registration.save();

        res.status(201).json({
            message: "Registratie succesvol!",
            registration
        });
    } catch (err) {
        res.status(500).json({
            message: "Fout bij registratie",
            error: err.message
        });
    }
};

