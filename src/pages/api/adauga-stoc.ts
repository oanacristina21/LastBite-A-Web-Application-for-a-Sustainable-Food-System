// /pages/api/adauga-stoc.ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { IdProdus, Cant_Disp} = req.body;

  if (!IdProdus || !Cant_Disp) {
    return res.status(400).json({ mesaj: 'Date lipsă' });
  }

  await prisma.sTOC.create({
    data: {
      IdProdus,
      Cant_Disp,
    },
  });

  return res.status(200).json({ mesaj: 'Stoc adăugat cu succes' });
}
