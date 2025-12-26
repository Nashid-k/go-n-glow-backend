import express from 'express';
import { getServices, createService, updateService, deleteService } from '../controllers/serviceController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/', getServices);
router.post('/', protect, authorize('admin'), createService);
router.put('/:id', protect, authorize('admin'), updateService);
router.delete('/:id', protect, authorize('admin'), deleteService);

export default router;
