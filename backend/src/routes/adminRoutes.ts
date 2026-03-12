import express from 'express';
import {
  getAllUsers,
  deleteUser,
  blockUser,
  getAllSessions,
  approveSession,
  rejectSession,
  deleteSessionAdmin,
  getAnalytics,
} from '../controllers/adminController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);
router.use(admin); // All admin routes require admin role

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/block', blockUser);

router.get('/sessions', getAllSessions);
router.delete('/sessions/:id', deleteSessionAdmin);
router.patch('/sessions/:id/approve', approveSession);
router.patch('/sessions/:id/reject', rejectSession);

router.get('/analytics', getAnalytics);

export default router;
