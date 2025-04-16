"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBClient = void 0;
const config_1 = require("./config");
const firestore_1 = require("firebase/firestore");
class DBClient {
    constructor(collectionName) {
        this.collectionName = collectionName;
        this.collectionRef = (0, firestore_1.collection)(config_1.db, collectionName);
    }
    // Create a new document with auto-generated ID
    async create(data) {
        const docRef = (0, firestore_1.doc)(this.collectionRef);
        const id = docRef.id;
        await (0, firestore_1.setDoc)(docRef, {
            ...data,
            id,
            createdAt: (0, firestore_1.serverTimestamp)(),
            updatedAt: (0, firestore_1.serverTimestamp)()
        });
        return id;
    }
    // Create a document with a specific ID
    async createWithId(id, data) {
        const docRef = (0, firestore_1.doc)(this.collectionRef, id);
        await (0, firestore_1.setDoc)(docRef, {
            ...data,
            id,
            createdAt: (0, firestore_1.serverTimestamp)(),
            updatedAt: (0, firestore_1.serverTimestamp)()
        });
    }
    // Get a document by ID
    async getById(id) {
        const docRef = (0, firestore_1.doc)(this.collectionRef, id);
        const docSnap = await (0, firestore_1.getDoc)(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        else {
            return null;
        }
    }
    // Update a document
    async update(id, data) {
        const docRef = (0, firestore_1.doc)(this.collectionRef, id);
        await (0, firestore_1.updateDoc)(docRef, {
            ...data,
            updatedAt: (0, firestore_1.serverTimestamp)()
        });
    }
    // Delete a document
    async delete(id) {
        const docRef = (0, firestore_1.doc)(this.collectionRef, id);
        await (0, firestore_1.deleteDoc)(docRef);
    }
    // Get all documents from a collection
    async getAll() {
        const querySnapshot = await (0, firestore_1.getDocs)(this.collectionRef);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    // Query documents with filters
    async query(conditions, orderByField, orderDirection, limitCount, startAfterDoc) {
        let q = this.collectionRef;
        // Apply where conditions
        conditions.forEach(condition => {
            q = (0, firestore_1.query)(q, (0, firestore_1.where)(condition.field, condition.operator, condition.value));
        });
        // Apply orderBy if specified
        if (orderByField) {
            q = (0, firestore_1.query)(q, (0, firestore_1.orderBy)(orderByField, orderDirection || 'asc'));
        }
        // Apply pagination if specified
        if (startAfterDoc) {
            q = (0, firestore_1.query)(q, (0, firestore_1.startAfter)(startAfterDoc));
        }
        // Apply limit if specified
        if (limitCount) {
            q = (0, firestore_1.query)(q, (0, firestore_1.limit)(limitCount));
        }
        const querySnapshot = await (0, firestore_1.getDocs)(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    // Get document reference
    getDocRef(id) {
        return (0, firestore_1.doc)(this.collectionRef, id);
    }
    // Convert Firebase timestamp to Date
    static timestampToDate(timestamp) {
        return timestamp.toDate();
    }
    // Get server timestamp
    static getServerTimestamp() {
        return (0, firestore_1.serverTimestamp)();
    }
}
exports.DBClient = DBClient;
