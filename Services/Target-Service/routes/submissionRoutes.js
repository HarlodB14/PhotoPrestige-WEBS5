import {deleteFromStorage} from "../services/storage.js";
import Submission from "../models/submission.js";
import authMiddleware from "../../Authentication/middleware/authMiddleware.js";

router.delete('/:submissionId', authMiddleware, deleteSubmission);

export const deleteSubmission = async (req, res) => {
    try {
        const submission = await Submission.findOne({
            _id: req.params.submissionId,
            userId: req.user.id
        });

        if (!submission) return res.status(404).json({ error: 'Not found' });

        await deleteFromStorage(submission.photoUrl);
        await submission.remove();

        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Deletion failed' });
    }
};