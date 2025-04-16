"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchFinancialNews = fetchFinancialNews;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const logger_1 = require("../utils/logger");
// List of financial news sources to fetch from
const NEWS_SOURCES = [
    {
        name: 'Financial Times',
        url: 'https://www.ft.com/markets',
        selector: '.o-teaser__heading a',
        baseUrl: 'https://www.ft.com'
    },
    {
        name: 'Bloomberg',
        url: 'https://www.bloomberg.com/markets',
        selector: '.story-package-module__story__headline-link',
        baseUrl: ''
    },
    {
        name: 'CNBC',
        url: 'https://www.cnbc.com/markets/',
        selector: '.Card-title a',
        baseUrl: ''
    }
];
// Stock symbols to look for in headlines
const STOCK_SYMBOLS = [
    { symbol: 'AAPL', keywords: ['Apple', 'iPhone', 'iPad', 'Tim Cook'] },
    { symbol: 'MSFT', keywords: ['Microsoft', 'Windows', 'Azure', 'Satya Nadella'] },
    { symbol: 'GOOGL', keywords: ['Google', 'Alphabet', 'Android', 'Sundar Pichai'] },
    { symbol: 'AMZN', keywords: ['Amazon', 'AWS', 'Jeff Bezos', 'Andy Jassy'] },
    { symbol: 'META', keywords: ['Meta', 'Facebook', 'Instagram', 'Mark Zuckerberg'] },
    { symbol: 'TSLA', keywords: ['Tesla', 'Elon Musk', 'Electric Vehicle', 'EV'] },
    { symbol: 'NVDA', keywords: ['Nvidia', 'GPU', 'Jensen Huang'] }
];
/**
 * Fetch financial news headlines from various sources
 */
async function fetchFinancialNews(limit = 5) {
    const allNewsItems = [];
    // Process each news source
    for (const source of NEWS_SOURCES) {
        try {
            logger_1.logger.info(`Fetching news from ${source.name}`);
            // Fetch the HTML content
            const response = await axios_1.default.get(source.url);
            const html = response.data;
            // Parse the HTML with cheerio
            const $ = cheerio.load(html);
            // Extract headlines
            const headlines = $(source.selector).slice(0, limit * 2); // Get more than needed in case some are filtered out
            // Process each headline
            headlines.each((i, element) => {
                if (allNewsItems.length >= limit * NEWS_SOURCES.length)
                    return false; // Stop if we have enough
                const title = $(element).text().trim();
                const relativeUrl = $(element).attr('href') || '';
                const url = relativeUrl.startsWith('http')
                    ? relativeUrl
                    : `${source.baseUrl}${relativeUrl}`;
                // Skip if title is empty or URL is invalid
                if (!title || !url)
                    return;
                // Create news item
                const newsItem = {
                    title,
                    summary: '', // Will be populated later
                    url,
                    source: source.name,
                    publishedAt: new Date(),
                    stockSymbols: findStockSymbols(title)
                };
                allNewsItems.push(newsItem);
            });
            logger_1.logger.info(`Fetched ${allNewsItems.length} headlines from ${source.name}`);
        }
        catch (error) {
            logger_1.logger.error(`Error fetching news from ${source.name}:`, error);
        }
    }
    // Fetch additional details for each news item
    const enrichedNewsItems = await Promise.all(allNewsItems.slice(0, limit).map(enrichNewsItem));
    return enrichedNewsItems.filter(Boolean);
}
/**
 * Find stock symbols mentioned in a headline
 */
function findStockSymbols(text) {
    const symbols = [];
    // Check each stock symbol
    for (const stock of STOCK_SYMBOLS) {
        // Check if the symbol itself is mentioned
        if (text.includes(stock.symbol)) {
            symbols.push(stock.symbol);
            continue;
        }
        // Check if any keywords are mentioned
        for (const keyword of stock.keywords) {
            if (text.toLowerCase().includes(keyword.toLowerCase())) {
                symbols.push(stock.symbol);
                break;
            }
        }
    }
    return [...new Set(symbols)]; // Remove duplicates
}
/**
 * Enrich a news item with additional details
 */
async function enrichNewsItem(newsItem) {
    try {
        logger_1.logger.info(`Enriching news item: ${newsItem.title}`);
        // Fetch the full article
        const response = await axios_1.default.get(newsItem.url);
        const html = response.data;
        // Parse the HTML with cheerio
        const $ = cheerio.load(html);
        // Extract summary (first paragraph or meta description)
        let summary = $('meta[name="description"]').attr('content') || '';
        if (!summary) {
            // Try to get the first paragraph
            summary = $('p').first().text().trim();
        }
        // Update the news item
        return {
            ...newsItem,
            summary: summary.substring(0, 200) + (summary.length > 200 ? '...' : '')
        };
    }
    catch (error) {
        logger_1.logger.error(`Error enriching news item: ${newsItem.title}`, error);
        return newsItem; // Return original item if enrichment fails
    }
}
