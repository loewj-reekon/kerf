import type { NextFunction, Request, Response } from 'express';

import type { Db } from './db';

declare global {
  namespace Express {
    interface Request {
      userId: number;
    }
  }
}

export function requireUser(db: Db) {
  const findUser = db.prepare('SELECT id FROM users WHERE token = ?');
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.get('authorization') ?? '';
    const token = header.replace(/^Bearer\s+/i, '');
    const user = token ? (findUser.get(token) as { id: number } | undefined) : undefined;
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    req.userId = user.id;
    next();
  };
}
