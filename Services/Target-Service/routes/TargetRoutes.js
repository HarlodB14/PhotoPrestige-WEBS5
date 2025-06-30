import express from 'express';
import {
    getTargetsByPlace,
    getTargetsByLocation
} from '../controllers/targetcontroller.js';

const router = express.Router();

// GET /targets/place?placeName=Amsterdam
router.get('/place', getTargetsByPlace);

// GET /targets/location?longitude=4.9&latitude=52.37&maxDistance=500
router.get('/location', getTargetsByLocation);

export default router;