import express from 'express';
import registerRouter from './routes/RegisterRoutes.js';
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import './consumers/authConsumer.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/register", registerRouter);

const PORT = process.env.REGISTER_PORT || 5007;
app.listen(PORT, () => {
    console.log(`Register service running on port ${PORT}`);
});