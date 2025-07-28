/**
 * @swagger
 * /api/restaurante:
 *   get:
 *     summary: Obține toate restaurantele
 *     responses:
 *       200:
 *         description: Lista restaurantelor
 */
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const restaurante = await prisma.rESTAURANT.findMany();
  res.status(200).json(restaurante);
}
