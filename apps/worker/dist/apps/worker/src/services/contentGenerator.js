"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateArticleContent = generateArticleContent;
const logger_1 = require("../utils/logger");
const AIAgent_1 = require("@common/ai-agent/AIAgent");
// Stock information mapping
const STOCK_INFO = {
    'AAPL': { name: 'Apple Inc.' },
    'MSFT': { name: 'Microsoft Corporation' },
    'GOOGL': { name: 'Alphabet Inc.' },
    'AMZN': { name: 'Amazon.com, Inc.' },
    'META': { name: 'Meta Platforms, Inc.' },
    'TSLA': { name: 'Tesla, Inc.' },
    'NVDA': { name: 'NVIDIA Corporation' },
    'JPM': { name: 'JPMorgan Chase & Co.' },
    'V': { name: 'Visa Inc.' },
    'WMT': { name: 'Walmart Inc.' }
};
/**
 * Generate article content using AI based on a news item
 */
async function generateArticleContent(newsItem) {
    try {
        logger_1.logger.info(`Generating content for news item: ${newsItem.title}`);
        // Initialize AI agent
        const aiAgent = new AIAgent_1.AIAgent();
        // Prepare stock keywords
        const stockKeywords = (newsItem.stockSymbols || []).map(symbol => ({
            symbol,
            name: STOCK_INFO[symbol]?.name || symbol
        }));
        // If no stock symbols were detected, add a general finance tag
        if (stockKeywords.length === 0) {
            stockKeywords.push({
                symbol: 'FINANCE',
                name: 'Financial Markets'
            });
        }
        // Generate English content
        logger_1.logger.info('Generating English content');
        const englishContent = await aiAgent.generateArticle({
            title: newsItem.title,
            summary: newsItem.summary,
            source: newsItem.source,
            url: newsItem.url,
            stockSymbols: newsItem.stockSymbols || [],
            language: 'en'
        });
        // Generate Hebrew content
        logger_1.logger.info('Generating Hebrew content');
        const hebrewContent = await aiAgent.generateArticle({
            title: newsItem.title,
            summary: newsItem.summary,
            source: newsItem.source,
            url: newsItem.url,
            stockSymbols: newsItem.stockSymbols || [],
            language: 'he'
        });
        // Generate tags
        const tags = await aiAgent.generateTags({
            title: newsItem.title,
            summary: newsItem.summary,
            stockSymbols: newsItem.stockSymbols || []
        });
        // Prepare the final article content
        const articleContent = {
            content: {
                en: {
                    title: englishContent.title,
                    content: englishContent.content,
                    summary: englishContent.summary
                },
                he: {
                    title: hebrewContent.title,
                    content: hebrewContent.content,
                    summary: hebrewContent.summary
                }
            },
            stockKeywords,
            author: 'AI Financial Analyst',
            tags
        };
        logger_1.logger.info('Article content generation completed');
        return articleContent;
    }
    catch (error) {
        logger_1.logger.error('Error generating article content:', error);
        throw new Error(`Failed to generate article content: ${error.message}`);
    }
}
