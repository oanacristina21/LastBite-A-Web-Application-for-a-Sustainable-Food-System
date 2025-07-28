// pages/api/produse/cu-stoc-si-fara-oferta.ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/authMiddleware';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ mesaj: 'Neautentificat' });

    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ mesaj: 'Token invalid sau expirat' });

    const userId = decoded.id;

    const utilizator = await prisma.uTILIZATOR.findUnique({
      where: { IdUtilizator: userId },
      include: {
        RESTAURANT: true,
      },
    });

    if (!utilizator || !utilizator.RESTAURANT) {
      return res.status(403).json({ mesaj: 'Acces interzis: nu ești restaurant' });
    }

    const idRestaurant = utilizator.RESTAURANT.IdRestaurant; 

    const produse = await prisma.pRODUS.findMany({
      where: {
        IdRestaurant: idRestaurant, 
        STOC: {
          some: {
            Cant_Disp: {
              gt: 0,
            },
          },
        },
        OFERTA: {
          none: {
            DataSfarsit: {
              gte: new Date(),
            },
          },
        },
      },
      select: {
        IdProdus: true,
        Denumire: true,
      },
    });

    return res.status(200).json(produse);
  } catch (error) {
    console.error('[EROARE_PRODUSE_CU_STOC_SI_FARA_OFERTA]', error);
    return res.status(500).json({ mesaj: 'Eroare la preluarea produselor eligibile' });
  }
}
