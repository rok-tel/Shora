import { GeneratedArticleContent } from '../types';
import logger from '../utils/logger';
import { AIAgent } from '@common/ai-agent/AIAgent';

export async function generateArticleContent(): Promise<GeneratedArticleContent> {
  try {
    const aiAgent = new AIAgent();
    
    // Generate content using AI
    const content = await aiAgent.generateArticle({
      title: "Market Analysis",
      summary: "Daily market analysis and insights",
      source: "AI Generated",
      url: "https://shora.com/market-analysis",
      stockSymbols: [],
      language: "en"
    });
    
    // Transform AI response to our article format
    const articleContent: GeneratedArticleContent = {
      title: content.title,
      content: content.content,
      summary: content.summary,
      tags: ["finance", "ai-generated"],
      author: "AI Writer"
    };

    logger.info('Article content generation completed');
    return articleContent;
  } catch (err) {
    const error = err as Error;
    logger.error('Failed to generate article content:', error);
    throw new Error(`Failed to generate article content: ${error.message}`);
  }
}
