"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const node_cron_1 = __importDefault(require("node-cron"));
const newsFetcher_1 = require("./services/newsFetcher");
const contentGenerator_1 = require("./services/contentGenerator");
const imageGenerator_1 = require("./services/imageGenerator");
const articlePublisher_1 = require("./services/articlePublisher");
const logger_1 = require("./utils/logger");
// Load environment variables
dotenv_1.default.config();
// Flag to determine if this is a one-time run or scheduled job
const isOneTimeRun = process.argv.includes('--run-once');
/**
 * Main function to generate and publish articles
 */
async function generateAndPublishArticles() {
    try {
        logger_1.logger.info('Starting article generation process');
        // 1. Fetch financial news headlines
        logger_1.logger.info('Fetching financial news headlines');
        const newsItems = await (0, newsFetcher_1.fetchFinancialNews)();
        logger_1.logger.info(`Fetched ${newsItems.length} news items`);
        // Process each news item
        for (const newsItem of newsItems) {
            try {
                // 2. Generate article content using AI
                logger_1.logger.info(`Generating article content for: ${newsItem.title}`);
                const articleContent = await (0, contentGenerator_1.generateArticleContent)(newsItem);
                // 3. Generate an image for the article
                logger_1.logger.info('Generating image for article');
                const imageUrl = await (0, imageGenerator_1.generateImage)(articleContent.title);
                // 4. Publish the article to the API
                logger_1.logger.info('Publishing article to API');
                const publishedArticle = await (0, articlePublisher_1.publishArticle)({
                    ...articleContent,
                    imageUrl,
                    isGenerated: true
                });
                logger_1.logger.info(`Successfully published article: ${publishedArticle.id}`);
            }
            catch (itemError) {
                logger_1.logger.error(`Error processing news item: ${newsItem.title}`, itemError);
                // Continue with next item even if one fails
            }
        }
        logger_1.logger.info('Article generation process completed');
    }
    catch (error) {
        logger_1.logger.error('Error in article generation process:', error);
    }
}
// If this is a one-time run, execute immediately
if (isOneTimeRun) {
    logger_1.logger.info('Running one-time article generation');
    generateAndPublishArticles()
        .then(() => {
        logger_1.logger.info('One-time article generation completed');
        process.exit(0);
    })
        .catch((error) => {
        logger_1.logger.error('Error in one-time article generation:', error);
        process.exit(1);
    });
}
else {
    // Schedule the job to run daily at 6 AM
    logger_1.logger.info('Scheduling article generation to run daily at 6 AM');
    node_cron_1.default.schedule('0 6 * * *', () => {
        logger_1.logger.info('Running scheduled article generation');
        generateAndPublishArticles();
    });
    logger_1.logger.info('Worker started in scheduled mode');
}
// Handle process termination
process.on('SIGINT', () => {
    logger_1.logger.info('Worker process terminated');
    process.exit(0);
});
process.on('SIGTERM', () => {
    logger_1.logger.info('Worker process terminated');
    process.exit(0);
});
