import mongoose from 'mongoose';
import 'dotenv/config';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log("connected");
    } catch (error) {
        console.error("connection failed:", error);
        process.exit(1);
    }
};

export default connectDB;
