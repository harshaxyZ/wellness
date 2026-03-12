import { Response } from 'express';
import { db } from '../lib/firebase';

export const getMe = async (req: any, res: Response) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (userDoc.exists) {
      res.json(userDoc.data());
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data' });
  }
};

// register and login are handled on frontend by firebase client SDK
// we can keep skeleton if needed or remove from routes.
export const syncUser = async (req: any, res: Response) => {
    // This is called after frontend login to ensure user exists in Firestore
    const { uid, name, email } = req.body;
    try {
        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            const userData = {
                uid,
                name,
                email,
                role: 'user',
                isBlocked: false,
                createdAt: new Date(),
            };
            await userRef.set(userData);
            res.status(201).json(userData);
        } else {
            res.json(userDoc.data());
        }
    } catch (error) {
        res.status(500).json({ message: 'Error syncing user' });
    }
}
