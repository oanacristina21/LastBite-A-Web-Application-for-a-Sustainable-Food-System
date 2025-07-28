import type { NextApiRequest } from 'next';
import { verifyToken } from './authMiddleware';

export function getUserFromRequest(req: NextApiRequest) {
  const token = req.cookies?.token;
  if (!token) return null;
  return verifyToken(token);
}
