"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseConfig = exports.storage = exports.auth = exports.db = exports.app = void 0;
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
const auth_1 = require("firebase/auth");
const storage_1 = require("firebase/storage");
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAhYNiL9BEsaZAo_fEkUSgawyh5ljzx8v0",
    authDomain: "shora-30b46.firebaseapp.com",
    projectId: "shora-30b46",
    storageBucket: "shora-30b46.firebasestorage.app",
    messagingSenderId: "65477791225",
    appId: "1:65477791225:web:bb9907f33a00a7f70f8128",
    measurementId: "G-Q3XXH9Y7CK"
};
exports.firebaseConfig = firebaseConfig;
// Initialize Firebase
const app = !(0, app_1.getApps)().length ? (0, app_1.initializeApp)(firebaseConfig) : (0, app_1.getApp)();
exports.app = app;
const db = (0, firestore_1.getFirestore)(app);
exports.db = db;
const auth = (0, auth_1.getAuth)(app);
exports.auth = auth;
const storage = (0, storage_1.getStorage)(app);
exports.storage = storage;
