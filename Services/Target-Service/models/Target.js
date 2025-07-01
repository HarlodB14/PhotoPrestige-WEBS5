import mongoose from 'mongoose';

const TargetSchema = new mongoose.Schema({
    title: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    imageUrl: {type: String, required: true},
    labels: [{
        label: String,
        score: Number  // score
    }],
    location: {
        type: {
            type: String,
            enum: ['Point'],  //locatie
            default: 'Point',
            required: true
        },
        coordinates: {
            type: [Number],  // [longitude, latitude]
            required: true,
            validate: {
                validator: (coords) => coords.length === 2,
                message: 'Coordinaten moet verzameling zijn van [longitude, latitude].'
            }
        }
    },
    radius: {type: Number, required: true},  // In meters
    ownerId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    startTime: {type: Date, required: true},
    endTime: {type: Date, required: true},
    participants: [{
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        photoUrl: {type: String, required: true},
        similarityScore: {type: Number, min: 0, max: 100},
        submissionTime: {type: Date, default: Date.now},
        upvotes: {type: Number, default: 0},
        downvotes: {type: Number, default: 0}
    }],
    winnerId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    isActive: {type: Boolean, default: true}
}, {timestamps: true});
TargetSchema.index({location: '2dsphere'});

export default mongoose.model('Target', TargetSchema);