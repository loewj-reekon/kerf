import type { Group } from '@kerf/shared';
import { Router } from 'express';

import type { Db } from '../db';
import { type MeasurementRow, toMeasurement } from '../rows';

export function measurementsRouter(db: Db) {
  const router = Router();

  const findProjectForUser = db.prepare(`
    SELECT p.id FROM projects p
    JOIN project_members pm ON pm.project_id = p.id
    WHERE p.id = ? AND pm.user_id = ?
  `);
  const listGroups = db.prepare(
    'SELECT id, project_id, name FROM measurement_groups WHERE project_id = ? ORDER BY id',
  );
  const listMeasurements = db.prepare(`
    SELECT m.* FROM measurements m
    JOIN measurement_groups g ON g.id = m.group_id
    WHERE g.project_id = ?
    ORDER BY m.created_at, m.id
  `);
  const findGroupForUser = db.prepare(`
    SELECT g.id FROM measurement_groups g
    JOIN project_members pm ON pm.project_id = g.project_id
    WHERE g.id = ? AND pm.user_id = ?
  `);
  const insertMeasurement = db.prepare(`
    INSERT INTO measurements (group_id, value, label, device_id, created_at, created_by)
    VALUES (?, ?, ?, ?, ?, ?)
    RETURNING *
  `);

  router.get('/projects/:id/measurements', (req, res) => {
    const projectId = Number(req.params.id);
    if (!findProjectForUser.get(projectId, req.userId)) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    const groups = listGroups.all(projectId) as { id: number; project_id: number; name: string }[];
    const rows = listMeasurements.all(projectId) as unknown as MeasurementRow[];
    const result: Group[] = groups.map((g) => ({
      id: g.id,
      projectId: g.project_id,
      name: g.name,
      measurements: rows.filter((r) => r.group_id === g.id).map(toMeasurement),
    }));
    res.json(result);
  });

  router.post('/groups/:id/measurements', (req, res) => {
    const groupId = Number(req.params.id);
    if (!findGroupForUser.get(groupId, req.userId)) {
      res.status(404).json({ error: 'Group not found' });
      return;
    }
    const { value, label, deviceId } = req.body ?? {};
    if (!Number.isInteger(value) || value <= 0) {
      res.status(400).json({ error: 'value must be a positive integer' });
      return;
    }
    if (typeof label !== 'string' || !label.trim()) {
      res.status(400).json({ error: 'label is required' });
      return;
    }
    const row = insertMeasurement.get(
      groupId,
      value,
      label.trim(),
      typeof deviceId === 'string' ? deviceId : 'unknown',
      Date.now(),
      req.userId,
    ) as unknown as MeasurementRow;
    res.status(201).json(toMeasurement(row));
  });

  return router;
}
