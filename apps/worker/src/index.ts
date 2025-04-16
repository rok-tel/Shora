import dotenv from 'dotenv';
import cron from 'node-cron';
import { fetchFinancialNews } from './services/newsFetcher';
import { generateArticleContent } from './services/contentGenerator';
import { generateImage } from './services/imageGenerator';
import { publishArticle } from './services/articlePublisher';
import logger from './utils/logger';
import { GeneratedArticleContent } from './types';

// Load environment variables
dotenv.config();

// Flag to determine if this is a one-time run or scheduled job
const isOneTimeRun = process.argv.includes('--run-once');

/**
 * Main function to generate and publish articles
 */
async function generateAndPublishArticles() {
  try {
    logger.info('Starting article generation process');
    
    // 1. Fetch financial news headlines
    logger.info('Fetching financial news headlines');
    const newsItems = await fetchFinancialNews();
    logger.info(`Fetched ${newsItems.length} news items`);
    
    // Process each news item
    for (const newsItem of newsItems) {
      try {
        // 2. Generate article content using AI
        logger.info(`Generating article content for: ${newsItem.title}`);
        const articleContent = await generateArticleContent(newsItem);
        
        // 3. Generate an image for the article
        logger.info('Generating image for article');
        const imageUrl = await generateImage(articleContent.title);
        
        // 4. Publish the article to the API
        logger.info('Publishing article to API');
        const fullArticleContent: GeneratedArticleContent = {
          ...articleContent,
          imageUrl,
          isGenerated: true
        };
        const articleId = await publishArticle(fullArticleContent);
        
        logger.info(`Successfully published article: ${articleId}`);
      } catch (itemError) {
        logger.error(`Error processing news item: ${newsItem.title}`, itemError);
        // Continue with next item even if one fails
      }
    }
    
    logger.info('Article generation process completed');
  } catch (error) {
    logger.error('Error in article generation process:', error);
  }
}

// If this is a one-time run, execute immediately
if (isOneTimeRun) {
  logger.info('Running one-time article generation');
  generateAndPublishArticles()
    .then(() => {
      logger.info('One-time article generation completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Error in one-time article generation:', error);
      process.exit(1);
    });
} else {
  // Schedule the job to run daily at 6 AM
  logger.info('Scheduling article generation to run daily at 6 AM');
  cron.schedule('0 6 * * *', () => {
    logger.info('Running scheduled article generation');
    generateAndPublishArticles();
  });
  
  logger.info('Worker started in scheduled mode');
}

// Handle process termination
process.on('SIGINT', () => {
  logger.info('Worker process terminated');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Worker process terminated');
  process.exit(0);
});
