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

// routes/TargetRoutes.js
router.post('/:targetId/submissions', upload.single('photo'), submitTargetAttempt);

// controllers/targetController.js
export const submitTargetAttempt = async (req, res) => {
    try {
        const { targetId } = req.params;
        const photoFile = req.file; // Using multer middleware

        // 1. Get target image
        const target = await Target.findById(targetId);
        if (!target) return res.status(404).json({ error: 'Target not found' });

        // 2. Analyze images (pseudo-code)
        const similarityScore = await compareImages(
            target.imageUrl,
            photoFile.path
        );

        // 3. Save submission
        const submission = await Submission.create({
            userId: req.user.id, // From auth middleware
            targetId,
            photoUrl: await uploadToStorage(photoFile),
            score: similarityScore
        });

        res.status(201).json(submission);
    } catch (error) {
        res.status(500).json({ error: 'Submission failed' });
    }
};

export default router;