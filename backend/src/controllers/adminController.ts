import { Request, Response } from 'express';
import { db, auth } from '../lib/firebase';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => doc.data());
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      if (userDoc.data()?.role === 'admin') {
         res.status(400).json({ message: 'Cannot delete admin' });
         return;
      }
      
      // Delete from Firebase Auth
      await auth.deleteUser(userId);
      // Delete from Firestore
      await userRef.delete();
      
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
    const userId = req.params.id;
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const isBlocked = !userDoc.data()?.isBlocked;
      await userRef.update({ isBlocked });
      
      // If blocking, disable in Firebase Auth too
      await auth.updateUser(userId, { disabled: isBlocked });
      
      res.json({ ...userDoc.data(), isBlocked });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error blocking user' });
  }
};

export const getAllSessions = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('sessions').get();
    const sessions = snapshot.docs.map(doc => ({ ...doc.data(), _id: doc.id }));
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions' });
  }
};

export const approveSession = async (req: Request, res: Response) => {
  try {
    const sessionRef = db.collection('sessions').doc(req.params.id);
    await sessionRef.update({ status: 'published' });
    const updated = await sessionRef.get();
    res.json(updated.data());
  } catch (error) {
    res.status(500).json({ message: 'Error approving session' });
  }
};

export const rejectSession = async (req: Request, res: Response) => {
  try {
    const sessionRef = db.collection('sessions').doc(req.params.id);
    await sessionRef.update({ status: 'draft' });
    const updated = await sessionRef.get();
    res.json(updated.data());
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting session' });
  }
};

export const deleteSessionAdmin = async (req: Request, res: Response) => {
  try {
    const sessionRef = db.collection('sessions').doc(req.params.id);
    await sessionRef.delete();
    res.json({ message: 'Session removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting session' });
  }
};

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const sessionsSnapshot = await db.collection('sessions').get();
    
    const totalUsers = usersSnapshot.size;
    const totalSessions = sessionsSnapshot.size;
    
    let publishedSessions = 0;
    let draftSessions = 0;
    const categoryCounts: Record<string, number> = {};

    sessionsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.status === 'published') publishedSessions++;
      else draftSessions++;

      const cat = data.category || 'Uncategorized';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const categoryStats = Object.keys(categoryCounts).map(cat => ({
      _id: cat,
      count: categoryCounts[cat]
    })).sort((a, b) => b.count - a.count).slice(0, 5);

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
