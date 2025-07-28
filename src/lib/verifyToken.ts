// src/lib/verifyToken.ts
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';

const SECRET = process.env.JWT_SECRET || 'secret123';

export function verifyToken(req: NextApiRequest, res: NextApiResponse) {
  const cookieHeader = req.headers.cookie;

  if (!cookieHeader) {
    res.status(401).json({ mesaj: 'Neautorizat' });
    return null;
  }

  const token = cookieHeader.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];

  try {
    const decoded = jwt.verify(token!, SECRET) as { id: number };
    return decoded;
  } catch {
    res.status(401).json({ mesaj: 'Token invalid' });
    return null;
  }
}
