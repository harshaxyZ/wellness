import express from 'express';
import { getMe, syncUser } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/sync', syncUser);
router.get('/me', protect, getMe);

export default router;
