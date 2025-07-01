import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Target', required: true },
    photoUrl: { type: String, required: true },
    score: { type: Number, min: 0, max: 100 },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Submission', submissionSchema);