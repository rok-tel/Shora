import * as functions from 'firebase-functions';
import { DBClient } from '@common/firebase/dbClient';

const articlesDB = new DBClient('articles');

export const addArticle = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { title, content, author } = req.body;
    if (!title || !content || !author) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const articleId = await articlesDB.create({
      title,
      content,
      author
    });

    res.status(200).json({ id: articleId });
  } catch (error) {
    console.error('Error adding article:', error);
    res.status(500).json({ error: 'Failed to add article' });
  }
});