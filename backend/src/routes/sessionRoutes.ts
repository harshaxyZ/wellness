import express from 'express';
import {
  createSession,
  getMySessions,
  getSessionById,
  updateSession,
  deleteSession,
  autosaveSession,
} from '../controllers/sessionController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect); // All session routes require protection

router.post('/', createSession);
router.get('/', getMySessions);
router.get('/:id', getSessionById);
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);
router.patch('/:id/autosave', autosaveSession);

export default router;
