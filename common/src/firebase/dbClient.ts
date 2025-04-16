import { db } from './config';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  DocumentReference,
  CollectionReference,
  Query,
  WhereFilterOp,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';

export class DBClient {
  private collectionName: string;
  private collectionRef: CollectionReference;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
    this.collectionRef = collection(db, collectionName);
  }

  // Create a new document with auto-generated ID
  async create(data: any): Promise<string> {
    const docRef = doc(this.collectionRef);
    const id = docRef.id;
    
    await setDoc(docRef, {
      ...data,
      id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return id;
  }

  // Create a document with a specific ID
  async createWithId(id: string, data: any): Promise<void> {
    const docRef = doc(this.collectionRef, id);
    
    await setDoc(docRef, {
      ...data,
      id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  // Get a document by ID
  async getById(id: string): Promise<DocumentData | null> {
    const docRef = doc(this.collectionRef, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  }

  // Update a document
  async update(id: string, data: any): Promise<void> {
    const docRef = doc(this.collectionRef, id);
    
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  }

  // Delete a document
  async delete(id: string): Promise<void> {
    const docRef = doc(this.collectionRef, id);
    await deleteDoc(docRef);
  }

  // Get all documents from a collection
  async getAll(): Promise<DocumentData[]> {
    const querySnapshot = await getDocs(this.collectionRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Query documents with filters
  async query(
    conditions: { field: string; operator: WhereFilterOp; value: any }[],
    orderByField?: string,
    orderDirection?: 'asc' | 'desc',
    limitCount?: number,
    startAfterDoc?: QueryDocumentSnapshot<DocumentData>
  ): Promise<DocumentData[]> {
    let q: Query = this.collectionRef;
    
    // Apply where conditions
    conditions.forEach(condition => {
      q = query(q, where(condition.field, condition.operator, condition.value));
    });
    
    // Apply orderBy if specified
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection || 'asc'));
    }
    
    // Apply pagination if specified
    if (startAfterDoc) {
      q = query(q, startAfter(startAfterDoc));
    }
    
    // Apply limit if specified
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Get document reference
  getDocRef(id: string): DocumentReference {
    return doc(this.collectionRef, id);
  }

  // Convert Firebase timestamp to Date
  static timestampToDate(timestamp: Timestamp): Date {
    return timestamp.toDate();
  }

  // Get server timestamp
  static getServerTimestamp() {
    return serverTimestamp();
  }
}
