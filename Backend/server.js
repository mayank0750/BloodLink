import express from 'express';
import cors from 'cors';
import env from 'dotenv';
import connectDB from './config/db.js';
import MessagesRoutes from './routes/MessagesRoutes.js';
import userRoutes from './routes/userRoutes.js';
import DonorRoutes from './routes/DonorRoutes.js';
import organRequestRoutes from './routes/organRequestRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load env vars
env.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());

app.use(cors());

app.use("/api/messaging", MessagesRoutes);

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

app.use('/api/donors', DonorRoutes);
app.use('/api/organ-requests', organRequestRoutes);
app.use('/api/locations', locationRoutes);

const PORT =  process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});