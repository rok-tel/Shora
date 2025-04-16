"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishArticle = publishArticle;
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../utils/logger");
// API endpoint for creating articles
const API_ENDPOINT = process.env.API_ENDPOINT || 'http://localhost:3001/api/articles';
const API_KEY = process.env.API_KEY || 'default-api-key';
/**
 * Publish an article to the API
 */
async function publishArticle(articleContent) {
    try {
        logger_1.logger.info('Publishing article to API');
        // Prepare the article data
        const articleData = {
            content: articleContent.content,
            imageUrl: articleContent.imageUrl,
            stockKeywords: articleContent.stockKeywords,
            author: articleContent.author,
            isPublished: true,
            isGenerated: true,
            tags: articleContent.tags
        };
        // Send the article to the API
        const response = await axios_1.default.post(API_ENDPOINT, articleData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            }
        });
        logger_1.logger.info(`Article published successfully with ID: ${response.data.id}`);
        return response.data;
    }
    catch (error) {
        logger_1.logger.error('Error publishing article:', error);
        throw new Error(`Failed to publish article: ${error.message}`);
    }
}
