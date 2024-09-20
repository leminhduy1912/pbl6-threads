import cookieParser from 'cookie-parser';  // Fix typo in import
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './db/connectDB.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import cors from 'cors';
import { v2 as cloudinary } from "cloudinary";
dotenv.config();
connectDB();

const corsOptions = {
  origin: 'http://localhost:5173', // Remove the trailing slash to match the exact origin
  credentials: true,  // Allow credentials like cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow all the necessary HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
};
const app = express();
// Middleware
app.use(express.json({limit:'60mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions)); // Use CORS with specified options
// Route 
app.use('/api/users', userRoutes);
app.use('/api/posts',postRoutes)

// Start server on the correct port
app.listen(5000, () => console.log('Server started on port 5000'));
