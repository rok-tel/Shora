import axios from 'axios';
import * as cheerio from 'cheerio';
import { logger } from '../utils/logger';

// Define the structure for news items
export interface NewsItem {
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: Date;
  stockSymbols?: string[];
}

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
export async function fetchFinancialNews(limit = 5): Promise<NewsItem[]> {
  const allNewsItems: NewsItem[] = [];
  
  // Process each news source
  for (const source of NEWS_SOURCES) {
    try {
      logger.info(`Fetching news from ${source.name}`);
      
      // Fetch the HTML content
      const response = await axios.get(source.url);
      const html = response.data;
      
      // Parse the HTML with cheerio
      const $ = cheerio.load(html);
      
      // Extract headlines
      const headlines = $(source.selector).slice(0, limit * 2); // Get more than needed in case some are filtered out
      
      // Process each headline
      headlines.each((i, element) => {
        if (allNewsItems.length >= limit * NEWS_SOURCES.length) return false; // Stop if we have enough
        
        const title = $(element).text().trim();
        const relativeUrl = $(element).attr('href') || '';
        const url = relativeUrl.startsWith('http') 
          ? relativeUrl 
          : `${source.baseUrl}${relativeUrl}`;
        
        // Skip if title is empty or URL is invalid
        if (!title || !url) return;
        
        // Create news item
        const newsItem: NewsItem = {
          title,
          summary: '', // Will be populated later
          url,
          source: source.name,
          publishedAt: new Date(),
          stockSymbols: findStockSymbols(title)
        };
        
        allNewsItems.push(newsItem);
      });
      
      logger.info(`Fetched ${allNewsItems.length} headlines from ${source.name}`);
    } catch (error) {
      logger.error(`Error fetching news from ${source.name}:`, error);
    }
  }
  
  // Fetch additional details for each news item
  const enrichedNewsItems = await Promise.all(
    allNewsItems.slice(0, limit).map(enrichNewsItem)
  );
  
  return enrichedNewsItems.filter(Boolean) as NewsItem[];
}

/**
 * Find stock symbols mentioned in a headline
 */
function findStockSymbols(text: string): string[] {
  const symbols: string[] = [];
  
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
async function enrichNewsItem(newsItem: NewsItem): Promise<NewsItem | null> {
  try {
    logger.info(`Enriching news item: ${newsItem.title}`);
    
    // Fetch the full article
    const response = await axios.get(newsItem.url);
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
  } catch (error) {
    logger.error(`Error enriching news item: ${newsItem.title}`, error);
    return newsItem; // Return original item if enrichment fails
  }
}
