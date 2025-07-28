//pages/api/statistici-utilizator.ts
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
      select: {
        StatusComanda: true,
        COMANDA_PRODUS: {
          select: {
            PretFinal: true,
            CantitateComandata: true,
          },
        },
      },
    });

    const totalComenzi = comenzi.length;
    const comenziActive = comenzi.filter(c =>
      c.StatusComanda !== 'Finalizata' && c.StatusComanda !== 'Anulata'
    ).length;

    const mancareSalvata = comenzi
  .filter(c => c.StatusComanda === 'Finalizata')
  .reduce((total, comanda) => {
    const suma = comanda.COMANDA_PRODUS.reduce(
      (sum, p) => sum + Number(p.PretFinal) * p.CantitateComandata,
      0
    );
    return total + suma;
  }, 0);


    return res.status(200).json({ totalComenzi, comenziActive, mancareSalvata });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mesaj: 'Eroare la preluarea statisticilor.' });
  }
}
