import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/authMiddleware';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ mesaj: 'Token lipsă' });

  const user = verifyToken(token);
  if (!user) return res.status(401).json({ mesaj: 'Token invalid sau expirat' });

  if (req.method !== 'GET') {
    return res.status(405).json({ mesaj: 'Metodă neacceptată' });
  }

  try {
    // Asigură-te că utilizatorul e restaurant
    const restaurant = await prisma.rESTAURANT.findUnique({
      where: { IdUtilizator: user.id }
    });

    if (!restaurant) {
      return res.status(403).json({ mesaj: 'Acces interzis - nu ești restaurant' });
    }

    const comenzi = await prisma.cOMANDA.findMany({
      where: { IdRestaurant: restaurant.IdRestaurant },
      orderBy: { DataComanda: 'desc' },
      include: {
        CLIENT: {
          select: { Nume: true, Prenume: true }
        },
        COMANDA_PRODUS: {
          include: {
            PRODUS: {
              select: { Denumire: true, Pret_Initial: true }
            }
          }
        }
      }
    });

    const rezultat = comenzi.map((c) => ({
      id: c.IdComanda,
      nrComanda: c.NrComanda,
      client: `${c.CLIENT?.Nume || ''} ${c.CLIENT?.Prenume || ''}`,
      produse: c.COMANDA_PRODUS.map(p => p.PRODUS?.Denumire || 'Produs necunoscut'),
      total: c.COMANDA_PRODUS.reduce((acc, p) => {
        const pret = p.PretFinal?.toNumber?.() || p.PRODUS?.Pret_Initial?.toNumber?.() || 0;
        return acc + pret * p.CantitateComandata;
      }, 0),
      data: c.DataComanda,
      status: c.StatusComanda
    }));

    return res.status(200).json(rezultat);
  } catch (error) {
    console.error('Eroare la preluarea comenzilor:', error);
    return res.status(500).json({ mesaj: 'Eroare internă' });
  }
}
