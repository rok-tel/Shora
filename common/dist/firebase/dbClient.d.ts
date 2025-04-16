import { DocumentData, QueryDocumentSnapshot, DocumentReference, WhereFilterOp, Timestamp } from 'firebase/firestore';
export declare class DBClient {
    private collectionName;
    private collectionRef;
    constructor(collectionName: string);
    create(data: any): Promise<string>;
    createWithId(id: string, data: any): Promise<void>;
    getById(id: string): Promise<DocumentData | null>;
    update(id: string, data: any): Promise<void>;
    delete(id: string): Promise<void>;
    getAll(): Promise<DocumentData[]>;
    query(conditions: {
        field: string;
        operator: WhereFilterOp;
        value: any;
    }[], orderByField?: string, orderDirection?: 'asc' | 'desc', limitCount?: number, startAfterDoc?: QueryDocumentSnapshot<DocumentData>): Promise<DocumentData[]>;
    getDocRef(id: string): DocumentReference;
    static timestampToDate(timestamp: Timestamp): Date;
    static getServerTimestamp(): import("@firebase/firestore").FieldValue;
}
