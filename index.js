import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routers/userRouter.js';
import router from './routers/fixedExpenseRouter.js';
import authenticateUser from './middlewares/authentication.js';
<<<<<<< HEAD

// Load environment variables
=======
import budgetRouter from './routers/budgetRoutes.js';
>>>>>>> fecdece7f05d34c1b2dcc3aab3f098ece13ee384
dotenv.config();

const app = express();
const mongoURI = process.env.MONGODB_URI;
// 1. JSON request body eka read karaganna me line eka ekathu karanna
app.use(express.json());

// 2. Routers tika backend ekata connect karanna
app.use('/api/users', userRouter);
app.use('/api/expenses', budgetRouter);

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

app.use('/budgets', budgetRouter);


app.listen(3000, (req, res) => {
    console.log('Server is running on port 3000');
});