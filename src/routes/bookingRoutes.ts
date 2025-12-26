import express from 'express';
import {
    createBooking,
    getUserBookings,
    getBooking,
    cancelBooking,
    getAllBookings,
} from '../controllers/bookingController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/', protect, getUserBookings);
router.get('/:id', protect, getBooking);
router.put('/:id/cancel', protect, cancelBooking);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllBookings);

export default router;
