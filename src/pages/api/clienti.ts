/**
 * @swagger
 * /api/clienti:
 *   get:
 *     summary: Obtine toți clienții
 *     responses:
 *       200:
 *         description: Lista clienților
 */

import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const clienti = await prisma.cLIENT.findMany();
  res.status(200).json(clienti);
}
