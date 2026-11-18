import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import { errorHandler } from './middleware/error';

dotenv.config();

import authRoutes from './routes/authRoutes';
import salonRoutes from './routes/salonRoutes';
import serviceRoutes from './routes/serviceRoutes';
import bookingRoutes from './routes/bookingRoutes';

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));

app.use('/api/auth', authRoutes);
app.use('/api/salons', salonRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({ success: true, message: 'Server is running' });
});

app.use(errorHandler);

async function startServer() {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET must be configured before starting the API.');
    }

    await connectDB();
    app.listen(PORT, () => {
        console.log('Server running in ' + (process.env.NODE_ENV || 'development') + ' mode on port ' + PORT);
    });
}

startServer().catch((error) => {
    console.error('Failed to start Go N Glow API:', error);
    process.exit(1);
});
