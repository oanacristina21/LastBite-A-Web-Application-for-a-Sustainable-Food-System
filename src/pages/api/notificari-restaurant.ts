// pages/api/notificari-restaurant.ts
import { PrismaClient } from '@prisma/client';
import { getUserFromRequest } from '@/lib/authHelpers';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = getUserFromRequest(req);
  if (!user) return res.status(401).json({ mesaj: 'Neautentificat' });

  const restaurant = await prisma.rESTAURANT.findUnique({
    where: { IdUtilizator: user.id },
  });

  if (!restaurant) return res.status(403).json({ mesaj: 'Nu ești restaurant.' });

  const notificari = await prisma.nOTIFICARE.findMany({
    where: {
      Destinatar: 'restaurant',
      COMANDA: {
        IdRestaurant: restaurant.IdRestaurant,
      },
    },
    include: {
      COMANDA: {
        include: {
          CLIENT: {
            select: { Nume: true, Prenume: true }
          }
        }
      }
    },
    orderBy: { DataOraNotificare: 'desc' }
  });

  res.status(200).json(notificari);
}
