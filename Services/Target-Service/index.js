import express from 'express';
import targetRouter from './routes/TargetRoutes.js';
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/target", targetRouter);

const PORT = process.env.TARGET_PORT || 5005;

app.listen(PORT, () => {
    console.log(`Target service running on port ${PORT}`);
})