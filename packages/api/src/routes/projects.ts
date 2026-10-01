import type { Project } from '@kerf/shared';
import { Router } from 'express';

import type { Db } from '../db';

export function projectsRouter(db: Db) {
  const router = Router();

  const listProjects = db.prepare(`
    SELECT p.id, p.name, COUNT(m.id) AS measurementCount
    FROM projects p
    JOIN project_members pm ON pm.project_id = p.id
    LEFT JOIN measurement_groups g ON g.project_id = p.id
    LEFT JOIN measurements m ON m.group_id = g.id
    WHERE pm.user_id = ?
    GROUP BY p.id
    ORDER BY p.id
  `);

  router.get('/projects', (req, res) => {
    res.json(listProjects.all(req.userId) as unknown as Project[]);
  });

  return router;
}
