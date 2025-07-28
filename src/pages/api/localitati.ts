import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const localitati = await prisma.lOCALITATE.findMany({
      include: {
        JUDET: true,
      },
    });

    const rezultat = localitati.map(loc => ({
      IdLocalitate: loc.IdLocalitate,
      Denumire: loc.Denumire,
      Judet: loc.JUDET.Denumire,
    }));

    return res.status(200).json(rezultat);
  } catch (err) {
    console.error("Eroare la interogare localitati:", err);
    return res.status(500).json({ mesaj: 'Eroare server' });
  }
}

