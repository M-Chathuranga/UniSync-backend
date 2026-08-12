import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
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
)   

app.use(express.json());

app.get('/', (req, res) => {
    console.log('Received request at ');
    res.send('Hello, World!');
});


app.listen(3000, (req, res) => {
    console.log('Server is running on port 3000');
});