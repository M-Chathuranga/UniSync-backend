import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routers/userRouter.js';
import router from './routers/fixedExpenseRouter.js';
import authenticateUser from './middlewares/authentication.js';
import budgetRouter from './routers/budgetRoutes.js';
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
)   

app.use(express.json());

app.use(authenticateUser);

app.use('/users', userRouter);
app.use('/fixedexpenses', router);

app.use('/budgets', budgetRouter);


app.listen(3000, (req, res) => {
    console.log('Server is running on port 3000');
});