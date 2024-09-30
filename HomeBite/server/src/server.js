// Use ES module import syntax
import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON payloads

// Your other routes and logic will go here...

// Connect to MongoDB
mongoose.connect('mongodb+srv://jayalekshmivj08:Harmony2024@cluster0.rifewjx.mongodb.net/UniTradeHorizons', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
