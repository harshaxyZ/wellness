import { Request, Response } from 'express';
import User from '../models/User';
import Session from '../models/Session';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select('-passwordHash');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.role === 'admin') {
         res.status(400).json({ message: 'Cannot delete admin' });
         return;
      }
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

export const blockUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.isBlocked = !user.isBlocked;
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error blocking user' });
  }
};

export const getAllSessions = async (req: Request, res: Response) => {
  try {
    const sessions = await Session.find({}).populate('userId', 'name email');
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions' });
  }
};

export const approveSession = async (req: Request, res: Response) => {
  try {
    const session = await Session.findById(req.params.id);
    if (session) {
      session.status = 'published';
      await session.save();
      res.json(session);
    } else {
      res.status(404).json({ message: 'Session not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error approving session' });
  }
};

export const rejectSession = async (req: Request, res: Response) => {
  try {
    const session = await Session.findById(req.params.id);
    if (session) {
      session.status = 'draft';
      await session.save();
      res.json(session);
    } else {
      res.status(404).json({ message: 'Session not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting session' });
  }
};

export const deleteSessionAdmin = async (req: Request, res: Response) => {
  try {
    const session = await Session.findById(req.params.id);
    if (session) {
      await session.deleteOne();
      res.json({ message: 'Session removed' });
    } else {
      res.status(404).json({ message: 'Session not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting session' });
  }
};

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalSessions = await Session.countDocuments({});
    const publishedSessions = await Session.countDocuments({ status: 'published' });
    const draftSessions = await Session.countDocuments({ status: 'draft' });
    
    // Most popular categories (aggregation)
    const categoryStats = await Session.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      totalUsers,
      totalSessions,
      publishedSessions,
      draftSessions,
      categoryStats,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics' });
  }
};
