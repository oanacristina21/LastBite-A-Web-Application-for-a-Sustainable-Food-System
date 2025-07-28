// pages/api/comenzi/[id]/anuleaza.ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/authMiddleware';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ mesaj: 'Token lipsă' });

  const user = verifyToken(token);
  if (!user) return res.status(401).json({ mesaj: 'Token invalid' });

  const id = parseInt(req.query.id as string);
  if (req.method !== 'PATCH') return res.status(405).end();

  const comanda = await prisma.cOMANDA.findUnique({
    where: { IdComanda: id },
    include: {
      COMANDA_PRODUS: true,
    },
  });

  if (!comanda || comanda.IdClient !== user.id || comanda.StatusComanda !== 'Plasata') {
    return res.status(403).json({ mesaj: 'Nu poți anula această comandă' });
  }

  // ✅ Reface stocurile
  for (const cp of comanda.COMANDA_PRODUS) {
    await prisma.sTOC.updateMany({
      where: { IdProdus: cp.IdProdus },
      data: { Cant_Disp: { increment: cp.CantitateComandata } },
    });
  }

  await prisma.cOMANDA.update({
    where: { IdComanda: id },
    data: { StatusComanda: 'Anulata' },
  });
  await prisma.nOTIFICARE.create({
    data: {
      Mesaj: `Comanda ta cu numărul ${comanda.NrComanda} a fost anulată.`,
      IdComanda: comanda.IdComanda,
      Destinatar: 'client',
      DataOraNotificare: new Date(),
    },
  });

  return res.status(200).json({ mesaj: 'Comandă anulată și stoc refăcut.' });
}
