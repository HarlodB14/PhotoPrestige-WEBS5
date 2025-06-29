import mongoose from 'mongoose';


const RegisterSchema = new mongoose.Schema({
    event: {type: String, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, required: true},
    role: {
        type: String,
        required: true,
        enum: ["Deelnemer", "Target_Eigenaar", "Admin"]
    }
}, {timestamps: true});

const Registration = mongoose.model('Registration', RegisterSchema);
export default Registration;
