import { Response, NextFunction } from 'express';
import { auth, db } from '../lib/firebase';

export const protect = async (req: any, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decodedToken = await auth.verifyIdToken(token);
      
      // Fetch user role and block status from Firestore
      const userDoc = await db.collection('users').doc(decodedToken.uid).get();
      
      if (!userDoc.exists) {
        // If user document doesn't exist, create it with default role
        const userData = {
          uid: decodedToken.uid,
          name: decodedToken.name || 'Anonymous',
          email: decodedToken.email,
          role: 'user',
          isBlocked: false,
          createdAt: new Date(),
        };
        await db.collection('users').doc(decodedToken.uid).set(userData);
        req.user = userData;
      } else {
        const userData = userDoc.data();
        if (userData?.isBlocked) {
          res.status(403).json({ message: 'User is blocked' });
          return;
        }
        req.user = userData;
      }

      next();
    } catch (error) {
      console.error('Auth Error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const admin = (req: any, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};
