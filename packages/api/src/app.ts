import express from 'express';

import { requireUser } from './auth';
import type { Db } from './db';
import { measurementsRouter } from './routes/measurements';
import { projectsRouter } from './routes/projects';

export function createApp(db: Db) {
  const app = express();
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use(requireUser(db));

  app.get('/me', (req, res) => {
    res.json(db.prepare('SELECT id, name FROM users WHERE id = ?').get(req.userId));
  });

  app.use(projectsRouter(db));
  app.use(measurementsRouter(db));

  return app;
}
