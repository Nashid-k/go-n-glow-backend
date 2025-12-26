import { Request, Response } from 'express';
import Service from '../models/Service';
import Salon from '../models/Salon';

// @desc    Get all services
// @route   GET /api/services
// @access  Public
export const getServices = async (req: Request, res: Response) => {
    try {
        const { salonId, category } = req.query;

        let query: any = {};

        if (salonId) {
            query.salonId = salonId;
        }

        if (category) {
            query.category = category;
        }

        const services = await Service.find(query).populate('salonId', 'name');

        res.status(200).json({
            success: true,
            count: services.length,
            data: services,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Server error' });
    }
};

// @desc    Create service
// @route   POST /api/services
// @access  Private/Admin
export const createService = async (req: Request, res: Response) => {
    try {
        const createdService = await Service.create(req.body);
        // Handle both single service and array return from create
        const service = Array.isArray(createdService) ? createdService[0] : createdService;

        // Add service to salon's services array
        if (service && service._id && service.salonId) {
            await Salon.findByIdAndUpdate(service.salonId, {
                $push: { services: service._id },
            });
        }

        res.status(201).json({
            success: true,
            data: service,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Server error' });
    }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Admin
export const updateService = async (req: Request, res: Response) => {
    try {
        const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }

        res.status(200).json({
            success: true,
            data: service,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Server error' });
    }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Admin
export const deleteService = async (req: Request, res: Response) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);

        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }

        // Remove service from salon's services array
        await Salon.findByIdAndUpdate(service.salonId, {
            $pull: { services: service._id },
        });

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Server error' });
    }
};
