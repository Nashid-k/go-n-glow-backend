import { Request, Response } from 'express';
import Salon from '../models/Salon';
import Service from '../models/Service';

// @desc    Get all salons with filters
// @route   GET /api/salons
// @access  Public
export const getSalons = async (req: Request, res: Response) => {
    try {
        const { city, search, sortBy } = req.query;

        let query: any = {};

        // Filter by city
        if (city) {
            query['location.city'] = { $regex: city, $options: 'i' };
        }

        // Search by name
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        let salonsQuery = Salon.find(query).populate('services');

        // Sort
        if (sortBy === 'rating') {
            salonsQuery = salonsQuery.sort({ rating: -1 });
        } else if (sortBy === 'name') {
            salonsQuery = salonsQuery.sort({ name: 1 });
        } else {
            salonsQuery = salonsQuery.sort({ createdAt: -1 });
        }

        const salons = await salonsQuery;

        res.status(200).json({
            success: true,
            count: salons.length,
            data: salons,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Server error' });
    }
};

// @desc    Get single salon
// @route   GET /api/salons/:id
// @access  Public
export const getSalon = async (req: Request, res: Response) => {
    try {
        const salon = await Salon.findById(req.params.id);

        if (!salon) {
            return res.status(404).json({ success: false, message: 'Salon not found' });
        }

        // Get all services for this salon
        const services = await Service.find({ salonId: salon._id });

        res.status(200).json({
            success: true,
            data: { ...salon.toObject(), services },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Server error' });
    }
};

// @desc    Create salon
// @route   POST /api/salons
// @access  Private/Admin
export const createSalon = async (req: Request, res: Response) => {
    try {
        const salon = await Salon.create(req.body);

        res.status(201).json({
            success: true,
            data: salon,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Server error' });
    }
};

// @desc    Update salon
// @route   PUT /api/salons/:id
// @access  Private/Admin
export const updateSalon = async (req: Request, res: Response) => {
    try {
        const salon = await Salon.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!salon) {
            return res.status(404).json({ success: false, message: 'Salon not found' });
        }

        res.status(200).json({
            success: true,
            data: salon,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Server error' });
    }
};

// @desc    Delete salon
// @route   DELETE /api/salons/:id
// @access  Private/Admin
export const deleteSalon = async (req: Request, res: Response) => {
    try {
        const salon = await Salon.findByIdAndDelete(req.params.id);

        if (!salon) {
            return res.status(404).json({ success: false, message: 'Salon not found' });
        }

        // Delete associated services
        await Service.deleteMany({ salonId: salon._id });

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Server error' });
    }
};

// @desc    Get salon availability
// @route   GET /api/salons/:id/availability
// @access  Public
export const getSalonAvailability = async (req: Request, res: Response) => {
    try {
        const { date } = req.query;
        const salon = await Salon.findById(req.params.id);

        if (!salon) {
            return res.status(404).json({ success: false, message: 'Salon not found' });
        }

        // Generate default time slots (9 AM to 8 PM, hourly)
        const defaultSlots = [
            '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
            '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
        ];

        res.status(200).json({
            success: true,
            data: { slots: defaultSlots },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Server error' });
    }
};
