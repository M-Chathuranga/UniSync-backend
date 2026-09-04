import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routers/userRouter.js';
import router from './routers/fixedExpenseRouter.js';
import authenticateUser from './middlewares/authentication.js';

// Load environment variables
dotenv.config();

const app = express();
const mongoURI = process.env.MONGODB_URI;


mongoose.connect(mongoURI).then(
() => {
    console.log('Connected to MongoDB');
}
).catch(
    (error) => {
        console.error('Error connecting to MongoDB:', error);
    }
);  

// Enable CORS and allow requests from React Native
app.use(cors());

app.use(express.json());

app.use('/users', userRouter);
app.use(authenticateUser);
app.use('/fixedexpenses', router);


app.listen(3000, (req, res) => {
    console.log('Server is running on port 3000');
});