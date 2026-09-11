import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRouter from './routers/authRoutes.js';
import userRouter from './routers/userRouter.js';
import expenseRouter from './routers/expenseRoutes.js';
import categoryRouter from './routers/categoryRoutes.js';
import fixedExpenseRouter from './routers/fixedExpenseRouter.js';
import notificationRouter from './routers/notificationRoutes.js';
import dashboardRouter from './routers/dashboardRouter.js';
import settingRouter from './routers/settingRouter.js';


import authenticateUser from './middlewares/authentication.js';





dotenv.config();

const app = express();

const mongoURI = process.env.MONGODB_URI;
const port = process.env.PORT ;



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


app.use('/auth', authRouter); // Use the authRouter for authentication routes
app.use(authenticateUser);

app.use('/users', userRouter);
app.use('/fixedexpenses', fixedExpenseRouter);
app.use('/expenses', expenseRouter);
app.use('/categories', categoryRouter);
app.use('/notifications', notificationRouter);
app.use('/dashboard', dashboardRouter);
app.use('/settings', settingRouter);




app.listen(port, (req, res) => {
    console.log(`Server is running on port ${port}`);
});