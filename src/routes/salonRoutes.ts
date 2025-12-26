import express from 'express';
import {
    getSalons,
    getSalon,
    createSalon,
    updateSalon,
    deleteSalon,
    getSalonAvailability,
} from '../controllers/salonController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/', getSalons);
router.get('/:id', getSalon);
router.get('/:id/availability', getSalonAvailability);
router.post('/', protect, authorize('admin'), createSalon);
router.put('/:id', protect, authorize('admin'), updateSalon);
router.delete('/:id', protect, authorize('admin'), deleteSalon);

export default router;
