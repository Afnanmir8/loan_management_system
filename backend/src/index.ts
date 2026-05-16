import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import mongoose from 'mongoose';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import borrowerRoutes from './routes/borrowerRoutes';
import loanRoutes from './routes/loanRoutes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/borrower', borrowerRoutes);
app.use('/api/loan', loanRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Error handling middleware
app.use(errorHandler);

// Connect to DB then start server; attempt to remove old utr unique index if present
connectDB().then(async () => {
  try {
    const coll = mongoose.connection.db.collection('loans');
    const indexes = await coll.indexes();
    const utrIndex = indexes.find((i: any) => i.name === 'collections.utrNumber_1');
    if (utrIndex) {
      await coll.dropIndex(utrIndex.name);
      console.log('Dropped old index: collections.utrNumber_1');
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : err;
    console.warn('Could not verify/drop old utr index:', message);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start server due to DB error:', err);
});
