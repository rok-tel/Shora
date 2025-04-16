import { auth, db } from './config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  UserCredential,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { User } from '../models/User';

export class AuthClient {
  // Sign up a new user
  async signUp(email: string, password: string, displayName: string): Promise<User> {
    try {
      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update the user profile with display name
      await updateProfile(firebaseUser, { displayName });
      
      // Create user document in Firestore
      const userData: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || email,
        displayName: displayName,
        photoURL: firebaseUser.photoURL || '',
        role: 'user', // Default role
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        preferredLanguage: 'en' // Default language
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      
      return userData;
    } catch (error) {
      console.error('Error signing up user:', error);
      throw error;
    }
  }
  
  // Sign in an existing user
  async signIn(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login timestamp
      const userRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true });
      
      return userCredential;
    } catch (error) {
      console.error('Error signing in user:', error);
      throw error;
    }
  }
  
  // Sign out the current user
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out user:', error);
      throw error;
    }
  }
  
  // Send password reset email
  async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }
  
  // Get the current user from Firestore
  async getCurrentUser(): Promise<User | null> {
    const firebaseUser = auth.currentUser;
    
    if (!firebaseUser) {
      return null;
    }
    
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        return userDoc.data() as User;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }
  
  // Get a user by ID from Firestore
  async getUserById(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        return userDoc.data() as User;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }
  
  // Update a user's profile
  async updateUserProfile(userId: string, data: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
      
      // If the current user is updating their own profile, also update Auth profile
      const currentUser = auth.currentUser;
      if (currentUser && currentUser.uid === userId) {
        if (data.displayName || data.photoURL) {
          await updateProfile(currentUser, {
            displayName: data.displayName || currentUser.displayName,
            photoURL: data.photoURL || currentUser.photoURL
          });
        }
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
  
  // Set up an auth state change listener
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }
  
  // Check if a user is an admin
  async isUserAdmin(userId: string): Promise<boolean> {
    try {
      const user = await this.getUserById(userId);
      return user?.role === 'admin';
    } catch (error) {
      console.error('Error checking if user is admin:', error);
      return false;
    }
  }
}
