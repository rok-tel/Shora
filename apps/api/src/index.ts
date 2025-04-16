import * as functions from 'firebase-functions';
import express from 'express';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, conf: { distDir: '.next' } });
const handle = app.getRequestHandler();
const server = express();

app.prepare().then(() => {
  server.all('*', (req, res) => {
    return handle(req, res);
  });
});

export const nextApp = functions.https.onRequest(server);