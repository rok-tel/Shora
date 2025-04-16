import { DBDocument, UserRole } from './types';
export interface User extends DBDocument {
    email: string;
    displayName: string;
    photoURL?: string;
    role: UserRole;
    createdAt: Date | any;
    lastLoginAt?: Date | any;
    preferredLanguage: 'en' | 'he';
}
export interface UserCreateInput {
    email: string;
    displayName: string;
    photoURL?: string;
    role?: UserRole;
    preferredLanguage?: 'en' | 'he';
}
