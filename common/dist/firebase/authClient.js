"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthClient = void 0;
const config_1 = require("./config");
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
class AuthClient {
    // Sign up a new user
    async signUp(email, password, displayName) {
        try {
            // Create the user in Firebase Auth
            const userCredential = await (0, auth_1.createUserWithEmailAndPassword)(config_1.auth, email, password);
            const firebaseUser = userCredential.user;
            // Update the user profile with display name
            await (0, auth_1.updateProfile)(firebaseUser, { displayName });
            // Create user document in Firestore
            const userData = {
                id: firebaseUser.uid,
                email: firebaseUser.email || email,
                displayName: displayName,
                photoURL: firebaseUser.photoURL || '',
                role: 'user', // Default role
                createdAt: (0, firestore_1.serverTimestamp)(),
                lastLoginAt: (0, firestore_1.serverTimestamp)(),
                preferredLanguage: 'en' // Default language
            };
            await (0, firestore_1.setDoc)((0, firestore_1.doc)(config_1.db, 'users', firebaseUser.uid), userData);
            return userData;
        }
        catch (error) {
            console.error('Error signing up user:', error);
            throw error;
        }
    }
    // Sign in an existing user
    async signIn(email, password) {
        try {
            const userCredential = await (0, auth_1.signInWithEmailAndPassword)(config_1.auth, email, password);
            // Update last login timestamp
            const userRef = (0, firestore_1.doc)(config_1.db, 'users', userCredential.user.uid);
            await (0, firestore_1.setDoc)(userRef, { lastLoginAt: (0, firestore_1.serverTimestamp)() }, { merge: true });
            return userCredential;
        }
        catch (error) {
            console.error('Error signing in user:', error);
            throw error;
        }
    }
    // Sign out the current user
    async signOut() {
        try {
            await (0, auth_1.signOut)(config_1.auth);
        }
        catch (error) {
            console.error('Error signing out user:', error);
            throw error;
        }
    }
    // Send password reset email
    async sendPasswordReset(email) {
        try {
            await (0, auth_1.sendPasswordResetEmail)(config_1.auth, email);
        }
        catch (error) {
            console.error('Error sending password reset email:', error);
            throw error;
        }
    }
    // Get the current user from Firestore
    async getCurrentUser() {
        const firebaseUser = config_1.auth.currentUser;
        if (!firebaseUser) {
            return null;
        }
        try {
            const userDoc = await (0, firestore_1.getDoc)((0, firestore_1.doc)(config_1.db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
                return userDoc.data();
            }
            else {
                return null;
            }
        }
        catch (error) {
            console.error('Error getting current user:', error);
            throw error;
        }
    }
    // Get a user by ID from Firestore
    async getUserById(userId) {
        try {
            const userDoc = await (0, firestore_1.getDoc)((0, firestore_1.doc)(config_1.db, 'users', userId));
            if (userDoc.exists()) {
                return userDoc.data();
            }
            else {
                return null;
            }
        }
        catch (error) {
            console.error('Error getting user by ID:', error);
            throw error;
        }
    }
    // Update a user's profile
    async updateUserProfile(userId, data) {
        try {
            const userRef = (0, firestore_1.doc)(config_1.db, 'users', userId);
            await (0, firestore_1.setDoc)(userRef, { ...data, updatedAt: (0, firestore_1.serverTimestamp)() }, { merge: true });
            // If the current user is updating their own profile, also update Auth profile
            const currentUser = config_1.auth.currentUser;
            if (currentUser && currentUser.uid === userId) {
                if (data.displayName || data.photoURL) {
                    await (0, auth_1.updateProfile)(currentUser, {
                        displayName: data.displayName || currentUser.displayName,
                        photoURL: data.photoURL || currentUser.photoURL
                    });
                }
            }
        }
        catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    }
    // Set up an auth state change listener
    onAuthStateChanged(callback) {
        return (0, auth_1.onAuthStateChanged)(config_1.auth, callback);
    }
    // Check if a user is an admin
    async isUserAdmin(userId) {
        try {
            const user = await this.getUserById(userId);
            return user?.role === 'admin';
        }
        catch (error) {
            console.error('Error checking if user is admin:', error);
            return false;
        }
    }
}
exports.AuthClient = AuthClient;
