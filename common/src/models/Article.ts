import { DBDocument, LocalizedContentMap, Timestamp } from './types';
import { StockReference } from './Stock';

export interface Article extends DBDocument {
  slug: string;
  content: LocalizedContentMap;
  imageUrl: string;
  stockKeywords: StockReference[];
  publishedAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  author: string;
  authorId?: string;
  isPublished: boolean;
  isGenerated: boolean;
  viewCount: number;
  tags: string[];
}

export interface ArticleCreateInput {
  content: LocalizedContentMap;
  imageUrl: string;
  stockKeywords: StockReference[];
  author: string;
  authorId?: string;
  isPublished?: boolean;
  isGenerated?: boolean;
  tags?: string[];
}
