import { Request, Response } from 'express';
import Booking from '../models/Booking';
import Service from '../models/Service';
import { AuthRequest } from '../middleware/auth';

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req: AuthRequest, res: Response) => {
    try {
        const { salonId, serviceIds, date, timeSlot, notes } = req.body;

        // Calculate total price
        const services = await Service.find({ _id: { $in: serviceIds } });
        const totalPrice = services.reduce((sum, service) => sum + service.price, 0);

        const booking = await Booking.create({
            userId: req.user?.id,
            salonId,
            serviceIds,
            date,
            timeSlot,
            totalPrice,
            notes,
            status: 'pending',
        });

        await booking.populate(['salonId', 'serviceIds']);

        res.status(201).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Server error' });
    }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
export const getUserBookings = async (req: AuthRequest, res: Response) => {
    try {
        const bookings = await Booking.find({ userId: req.user?.id })
            .populate('salonId', 'name location images')
            .populate('serviceIds', 'name price duration')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Server error' });
    }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = async (req: AuthRequest, res: Response) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('salonId')
            .populate('serviceIds')
            .populate('userId', 'name email phone');

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Make sure user is booking owner or admin
        if (booking.userId._id.toString() !== req.user?.id && req.user?.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to access this booking' });
        }

        res.status(200).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Server error' });
    }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req: AuthRequest, res: Response) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Make sure user is booking owner
        if (booking.userId.toString() !== req.user?.id && req.user?.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to cancel this booking' });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.status(200).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Server error' });
    }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/admin/bookings
// @access  Private/Admin
export const getAllBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await Booking.find()
            .populate('userId', 'name email phone')
            .populate('salonId', 'name location')
            .populate('serviceIds', 'name price')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Server error' });
    }
};
