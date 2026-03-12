import { Request, Response } from 'express';
import Session from '../models/Session';

export const createSession = async (req: any, res: Response) => {
  try {
    const session = new Session({
      userId: req.user._id,
      title: 'Untitled Session',
      status: 'draft',
    });
    const createdSession = await session.save();
    res.status(201).json(createdSession);
  } catch (error) {
    res.status(500).json({ message: 'Error creating session' });
  }
};

export const getMySessions = async (req: any, res: Response) => {
  try {
    const sessions = await Session.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions' });
  }
};

export const getSessionById = async (req: any, res: Response) => {
  try {
    const session = await Session.findById(req.params.id);
    if (session && session.userId.toString() === req.user._id.toString()) {
      res.json(session);
    } else {
      res.status(404).json({ message: 'Session not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching session' });
  }
};

export const updateSession = async (req: any, res: Response) => {
  try {
    const session = await Session.findById(req.params.id);
    if (session && session.userId.toString() === req.user._id.toString()) {
      Object.assign(session, req.body);
      const updatedSession = await session.save();
      res.json(updatedSession);
    } else {
      res.status(404).json({ message: 'Session not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating session' });
  }
};

export const deleteSession = async (req: any, res: Response) => {
  try {
    const session = await Session.findById(req.params.id);
    if (session && session.userId.toString() === req.user._id.toString()) {
      await session.deleteOne();
      res.json({ message: 'Session removed' });
    } else {
      res.status(404).json({ message: 'Session not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting session' });
  }
};

export const autosaveSession = async (req: any, res: Response) => {
  try {
    const session = await Session.findById(req.params.id);
    if (session && session.userId.toString() === req.user._id.toString()) {
      // Only update specific fields for autosave if needed, but for simplicity:
      Object.assign(session, req.body);
      session.status = 'draft'; // Ensure it stays as draft during autosave
      const updatedSession = await session.save();
      res.json(updatedSession);
    } else {
      res.status(404).json({ message: 'Session not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error during autosave' });
  }
};
