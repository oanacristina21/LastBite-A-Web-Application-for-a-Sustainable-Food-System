/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtine toti utilizatorii
 *     responses:
 *       200:
 *         description: Lista utilizatorilor
 */

import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const users = await prisma.uTILIZATOR.findMany();
  res.status(200).json(users);
}
