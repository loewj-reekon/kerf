import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createApp } from './app';
import { openDb } from './db';

const PORT = Number(process.env.PORT ?? 4000);
const DB_PATH =
  process.env.DB_PATH ?? join(dirname(fileURLToPath(import.meta.url)), '../data/kerf.db');

mkdirSync(dirname(DB_PATH), { recursive: true });
const db = openDb(DB_PATH);

const server = createApp(db).listen(PORT, () => {
  console.log(`Kerf API listening on http://localhost:${PORT}`);
});

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the other process or set PORT.`);
    process.exit(1);
  }
  throw err;
});
