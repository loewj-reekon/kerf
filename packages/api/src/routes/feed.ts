import type { FeedItem } from '@kerf/shared';
import { Router } from 'express';

import type { Db } from '../db';
import { type MeasurementRow, toMeasurement } from '../rows';

const FEED_SIZE = 20;

type FeedRow = MeasurementRow & { project_id: number; project_name: string; group_name: string };

function toFeedItem(row: FeedRow): FeedItem {
  return {
    ...toMeasurement(row),
    projectId: row.project_id,
    projectName: row.project_name,
    groupName: row.group_name,
  };
}

export function feedRouter(db: Db) {
  const router = Router();

  const latest = db.prepare(`
    SELECT m.*, g.project_id, g.name AS group_name, p.name AS project_name
    FROM measurements m
    JOIN measurement_groups g ON g.id = m.group_id
    JOIN projects p ON p.id = g.project_id
    JOIN project_members pm ON pm.project_id = p.id
    WHERE pm.user_id = ?
    ORDER BY m.created_at DESC, m.id DESC
    LIMIT ${FEED_SIZE}
  `);

  router.get('/feed', (req, res) => {
    res.json((latest.all(req.userId) as unknown as FeedRow[]).map(toFeedItem));
  });

  return router;
}
