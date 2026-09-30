import { DatabaseSync } from 'node:sqlite';

import { seed } from './seed';

export type Db = DatabaseSync;

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE
  );
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    owner_id INTEGER NOT NULL REFERENCES users(id)
  );
  CREATE TABLE IF NOT EXISTS project_members (
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id),
    PRIMARY KEY (project_id, user_id)
  );
  CREATE TABLE IF NOT EXISTS measurement_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS measurements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER NOT NULL REFERENCES measurement_groups(id) ON DELETE CASCADE,
    value INTEGER NOT NULL,
    label TEXT NOT NULL,
    device_id TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    created_by INTEGER NOT NULL REFERENCES users(id)
  );
  CREATE INDEX IF NOT EXISTS measurements_created_at ON measurements(created_at);
`;

const TABLES = ['measurements', 'measurement_groups', 'project_members', 'projects', 'users'];

export function openDb(path: string): Db {
  const db = new DatabaseSync(path);
  db.exec('PRAGMA foreign_keys = ON');
  db.exec(SCHEMA);
  const { count } = db.prepare('SELECT COUNT(*) AS count FROM users').get() as { count: number };
  if (count === 0) {
    seed(db);
  }
  return db;
}

export function resetDb(db: Db) {
  db.exec('BEGIN');
  for (const table of TABLES) {
    db.exec(`DELETE FROM ${table}`);
  }
  db.exec(`DELETE FROM sqlite_sequence`);
  seed(db);
  db.exec('COMMIT');
}
