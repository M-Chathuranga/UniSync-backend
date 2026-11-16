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
// ==========================================
// Google Play Store Compliance Pages
// ==========================================

// 1. Public Privacy Policy Page (GET /privacy-policy)
app.get('/privacy-policy', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Privacy Policy - Smart Finance</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 800px; margin: 0 auto; padding: 24px; background: #f8fafc; }
        .card { background: #ffffff; padding: 32px; border-radius: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        h1 { color: #4143d5; margin-top: 0; }
        h2 { color: #0f172a; margin-top: 24px; font-size: 1.15rem; }
        p, li { color: #475569; font-size: 0.95rem; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Privacy Policy for Smart Finance</h1>
        <p><strong>Effective Date:</strong> November 2026</p>
        <p>Smart Finance ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how your information is collected, used, and safeguarded when you use our mobile application.</p>

        <h2>1. Information We Collect</h2>
        <ul>
          <li><strong>Account Information:</strong> Name, email address, and encrypted password when you register an account.</li>
          <li><strong>Financial & Budget Data:</strong> Monthly allowance, expense entries, custom categories, and currency preferences that you voluntarily input.</li>
          <li><strong>Voice Audio Data:</strong> Temporary voice recordings captured only when you actively tap the voice expense logging button.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To provide personal expense tracking, daily safe-to-spend calculations, and budget analytics.</li>
          <li>To transcribe spoken expense descriptions into structured text entries.</li>
          <li>To sync your data securely across sessions.</li>
        </ul>

        <h2>3. Microphone & Voice Processing</h2>
        <p>Smart Finance requests microphone access (<code>RECORD_AUDIO</code>) strictly for voice-activated expense logging. Audio is processed securely in real time for speech-to-text transcription and is <strong>not permanently stored</strong> on our servers or shared with advertisers.</p>

        <h2>4. Biometric Authentication</h2>
        <p>Fingerprint and Face ID unlock features rely entirely on your device's built-in operating system security. Smart Finance never accesses, collects, or stores your biometric templates.</p>

        <h2>5. Data Sharing & Security</h2>
        <p>We do not sell, rent, or trade your personal or financial data to third parties. All communications between the app and our servers are encrypted using HTTPS.</p>

        <h2>6. Account & Data Deletion</h2>
        <p>You can permanently delete your account and all associated financial records at any time directly inside the app via <strong>Settings &rarr; Delete Account</strong>. Upon deletion, all your user profile data, expenses, and custom categories are permanently erased from our database.</p>

        <h2>7. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact the developer at: <strong>support@smartfinance.lk</strong></p>
      </div>
    </body>
    </html>
  `);
});

// 2. Public Account Deletion Information Page (GET /delete-account-info)
app.get('/delete-account-info', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Account Deletion - Smart Finance</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 700px; margin: 0 auto; padding: 24px; background: #f8fafc; }
        .card { background: #ffffff; padding: 32px; border-radius: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        h1 { color: #dc2626; margin-top: 0; }
        h2 { color: #0f172a; font-size: 1.1rem; }
        ol, p { color: #475569; font-size: 0.95rem; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Smart Finance - Account & Data Deletion</h1>
        <p>Users of the <strong>Smart Finance</strong> mobile application can permanently delete their account and all stored personal data at any time.</p>

        <h2>How to Delete Your Account In-App:</h2>
        <ol>
          <li>Open the <strong>Smart Finance</strong> app and log in to your account.</li>
          <li>Tap on your <strong>Profile Avatar (top-right corner)</strong> to open <strong>Settings</strong>.</li>
          <li>Scroll down to the <strong>Privacy & Data</strong> section and tap <strong>Delete Account</strong>.</li>
          <li>Confirm the permanent deletion prompt.</li>
        </ol>

        <h2>What Data Is Deleted:</h2>
        <p>Once confirmed, the following data is immediately and permanently removed from our database with zero retention period:</p>
        <ul>
          <li>Your user profile (name, email address, and credentials)</li>
          <li>All recorded expense transactions and budget history</li>
          <li>All custom categories and preferences</li>
        </ul>
      </div>
    </body>
    </html>
  `);
});

// Global Middleware: Log all incoming HTTP requests to console for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Root API Health Check Route
app.get('/', (req, res) => {
  return res.status(200).json({ message: 'UniSync Backend API is active and running' });
});


app.use('/auth', authRouter); // Use the authRouter for authentication routes
app.use('/api/auth', authRouter); // Additional fallback mapping for mobile requests
app.use(authenticateUser);

app.use('/users', userRouter);
app.use('/fixedexpenses', fixedExpenseRouter);
app.use('/expenses', expenseRouter);
app.use('/categories', categoryRouter);
app.use('/notifications', notificationRouter);
app.use('/dashboard', dashboardRouter);
app.use('/settings', settingRouter);




app.listen(3000, '0.0.0.0', () => {
  console.log('Server is running on port 3000');
});