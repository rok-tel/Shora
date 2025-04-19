export type Language = 'en' | 'he';

export interface LocalizedContent {
  title: string;
  content: string;
  summary: string;
}

export type LocalizedContentMap = {
  [key in Language]: LocalizedContent;
};

export interface Timestamp {
  seconds: number;
  nanoseconds: number;
  toDate: () => Date;
}

export type UserRole = 'user' | 'admin';

export interface DBDocument {
  id?: string;
}

export interface IDBClient {
  getAll(): Promise<DBDocument[]>;
  getById(id: string): Promise<DBDocument | null>;
  create(obj: DBDocument): Promise<string>;
}