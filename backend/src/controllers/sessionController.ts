import { Response } from 'express';
import { db } from '../lib/firebase';
import * as admin from 'firebase-admin';

export const createSession = async (req: any, res: Response) => {
  try {
    const sessionRef = db.collection('sessions').doc();
    const sessionData = {
      _id: sessionRef.id,
      userId: req.user.uid,
      title: 'Untitled Session',
      description: '',
      category: 'Uncategorized',
      duration: 0,
      steps: [{ title: '', content: '' }],
      status: 'draft',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await sessionRef.set(sessionData);
    res.status(201).json(sessionData);
  } catch (error) {
    res.status(500).json({ message: 'Error creating session' });
  }
};

export const getMySessions = async (req: any, res: Response) => {
  try {
    const snapshot = await db.collection('sessions')
      .where('userId', '==', req.user.uid)
      .orderBy('updatedAt', 'desc')
      .get();
    
    const sessions = snapshot.docs.map(doc => ({ ...doc.data(), _id: doc.id }));
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching sessions' });
  }
};

export const getSessionById = async (req: any, res: Response) => {
  try {
    const doc = await db.collection('sessions').doc(req.params.id).get();
    if (doc.exists) {
      const session = doc.data();
      if (session?.userId === req.user.uid) {
        res.json({ ...session, _id: doc.id });
      } else {
        res.status(403).json({ message: 'Not authorized' });
      }
    } else {
      res.status(404).json({ message: 'Session not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching session' });
  }
};

export const updateSession = async (req: any, res: Response) => {
  try {
    const sessionRef = db.collection('sessions').doc(req.params.id);
    const doc = await sessionRef.get();

    if (doc.exists && doc.data()?.userId === req.user.uid) {
      const updatedData = {
        ...req.body,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      await sessionRef.update(updatedData);
      res.json({ ...doc.data(), ...updatedData, _id: doc.id });
    } else {
      res.status(404).json({ message: 'Session not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating session' });
  }
};

export const deleteSession = async (req: any, res: Response) => {
  try {
    const sessionRef = db.collection('sessions').doc(req.params.id);
    const doc = await sessionRef.get();

    if (doc.exists && doc.data()?.userId === req.user.uid) {
      await sessionRef.delete();
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
    const sessionRef = db.collection('sessions').doc(req.params.id);
    const doc = await sessionRef.get();

    if (doc.exists && doc.data()?.userId === req.user.uid) {
      const updatedData = {
        ...req.body,
        status: 'draft',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      await sessionRef.update(updatedData);
      res.json({ ...doc.data(), ...updatedData, _id: doc.id });
    } else {
      res.status(404).json({ message: 'Session not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error during autosave' });
  }
};
