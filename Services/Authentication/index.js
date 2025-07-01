import express from 'express';
import mongoose from 'mongoose';
import authRouter from './routes/authRoutes.js';
import connectDB from './config/db.js';
import cors from 'cors';
import { connection } from './Utils/rabbitmq.js';

console.log('mongoose:', mongoose);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB
connectDB();

// Routes
app.use('/api/auth', authRouter);

app.get('/health', (req, res) => res.status(200).send('OK'));

const PORT = process.env.AUTH_PORT || 5006;
app.listen(PORT, () => console.log(`Auth service running on port ${PORT}`));