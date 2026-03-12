import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  getIdToken
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import api from '../lib/api';
import { AuthResponse, User, LoginCredentials, RegisterCredentials } from '../types';

export const authService = {
  async login({ email, password }: LoginCredentials): Promise<AuthResponse> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await getIdToken(userCredential.user);
    
    // Sync with backend
    const { data } = await api.post('/auth/sync', {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      name: userCredential.user.displayName || 'User',
    });

    return { user: data, token };
  },

  async register({ email, password, name }: RegisterCredentials): Promise<AuthResponse> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const token = await getIdToken(userCredential.user);
    
    // Sync with backend
    const { data } = await api.post('/auth/sync', {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      name: name,
    });

    return { user: data, token };
  },

  async logout(): Promise<void> {
    await signOut(auth);
    localStorage.removeItem('token');
  },

  async getMe(): Promise<User> {
    const { data } = await api.get('/auth/me');
    return data;
  },

  onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
};
