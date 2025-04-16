import { DBDocument, LocalizedContentMap, Timestamp } from './types';
export interface Stock extends DBDocument {
    symbol: string;
    name: string;
    description: LocalizedContentMap;
    currentPrice?: number;
    previousClose?: number;
    change?: number;
    changePercent?: number;
    marketCap?: number;
    sector?: string;
    industry?: string;
    updatedAt: Timestamp | Date;
}
export interface StockReference {
    symbol: string;
    name: string;
    priceAtPublication?: number;
}
