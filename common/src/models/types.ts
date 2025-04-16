export interface Language {
  code: 'en' | 'he';
  name: string;
}

export interface LocalizedContent {
  title: string;
  content: string;
  summary: string;
}

export type LocalizedContentMap = {
  [key in 'en' | 'he']: LocalizedContent;
};

export interface Timestamp {
  seconds: number;
  nanoseconds: number;
  toDate: () => Date;
}

export type UserRole = 'user' | 'admin';

export interface DBDocument {
  id: string;
}
