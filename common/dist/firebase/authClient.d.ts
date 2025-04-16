import { User as FirebaseUser, UserCredential } from 'firebase/auth';
import { User } from '../models/User';
export declare class AuthClient {
    signUp(email: string, password: string, displayName: string): Promise<User>;
    signIn(email: string, password: string): Promise<UserCredential>;
    signOut(): Promise<void>;
    sendPasswordReset(email: string): Promise<void>;
    getCurrentUser(): Promise<User | null>;
    getUserById(userId: string): Promise<User | null>;
    updateUserProfile(userId: string, data: Partial<User>): Promise<void>;
    onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void;
    isUserAdmin(userId: string): Promise<boolean>;
}
