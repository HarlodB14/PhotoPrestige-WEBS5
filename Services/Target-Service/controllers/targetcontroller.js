import Target from "../models/Target.js";


export function target(req, res) {

}

export const getTargetsByPlace = async (req, res) => {
    try {
        const {placeName} = req.query;
        const targets = await Target.find({
            placeName: new RegExp(placeName, 'i'),
            isActive: true
        });
        res.status(200).json(targets);
    } catch (error) {
        res.status(500).json({error: 'Server Fout'});
    }
};

export const getTargetsByLocation = async (req, res) => {
    try {
        const {longitude, latitude, maxDistance = 1000} = req.query; // Default naar 1km

        const targets = await Target.find({
            location: {
                $near: {
                    $geometry: {type: 'Point', coordinates: [longitude, latitude]},
                    $maxDistance: maxDistance
                }
            },
            isActive: true
        });

        res.status(200).json(targets);
    } catch (error) {
        res.status(500).json({error: 'Server Fout'});
    }
};