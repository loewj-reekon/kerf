import express from 'express';

import { requireUser } from './auth';
import { type Db, resetDb } from './db';
import { measurementsRouter } from './routes/measurements';
import { projectsRouter } from './routes/projects';

export function createApp(db: Db) {
  const app = express();
  app.use(express.json());

  // The app calls the API from another origin (the Expo dev server on :8081).
  app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.set(
      'Access-Control-Allow-Headers',
      req.get('access-control-request-headers') ?? 'authorization, content-type',
    );
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use(requireUser(db));

  app.get('/me', (req, res) => {
    res.json(db.prepare('SELECT id, name FROM users WHERE id = ?').get(req.userId));
  });

  app.post('/dev/reset', (_req, res) => {
    resetDb(db);
    res.json({ ok: true });
  });

  app.use(projectsRouter(db));
  app.use(measurementsRouter(db));

  return app;
}
