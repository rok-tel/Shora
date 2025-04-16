import { GeneratedArticleContent } from '../types';
import logger from '../utils/logger';
import { DBClient } from '@common/firebase/dbClient';

const articlesDB = new DBClient('articles');

export async function publishArticle(articleContent: GeneratedArticleContent): Promise<string> {
  try {
    const articleId = await articlesDB.create({
      title: articleContent.title,
      content: articleContent.content,
      summary: articleContent.summary,
      imageUrl: articleContent.imageUrl,
      tags: articleContent.tags,
      author: articleContent.author
    });

    logger.info(`Article published successfully with ID: ${articleId}`);
    return articleId;
  } catch (err) {
    const error = err as Error;
    logger.error('Failed to publish article:', error);
    throw new Error(`Failed to publish article: ${error.message}`);
  }
}
