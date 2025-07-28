import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/authMiddleware';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies?.token;
if (!token) return res.status(401).json({ mesaj: 'Token lipsă' });

const user = verifyToken(token);
if (!user) return res.status(401).json({ mesaj: 'Token invalid sau expirat' });


  if (!user) return res.status(401).json({ mesaj: 'Neautorizat' });

  try {
    const comenzi = await prisma.cOMANDA.findMany({
      where: { IdClient: user.id },
      orderBy: { DataComanda: 'desc' },
      take: 3,
      select: {
        IdComanda: true,
        NrComanda: true,
        DataComanda: true,
        StatusComanda: true,
        COMANDA_PRODUS: {
          select: {
            CantitateComandata: true,
            PretFinal: true,
          },
        },
      },
    });

    const rezultat = comenzi.map((c) => ({
      id: c.IdComanda,
      nr: c.NrComanda,
      data: c.DataComanda,
      status: c.StatusComanda,
      total: c.COMANDA_PRODUS.reduce((acc, p) => acc + Number(p.PretFinal) * p.CantitateComandata, 0),
    }));

    return res.status(200).json(rezultat);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mesaj: 'Eroare la preluarea comenzilor' });
  }
}
