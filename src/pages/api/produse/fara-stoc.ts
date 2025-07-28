// /pages/api/produse/fara-stoc.ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const produse = await prisma.pRODUS.findMany({
    where: {
      STOC: { none: {} },
    },
    select: {
      IdProdus: true,
      Denumire: true,
    },
  });

  res.status(200).json(produse);
}
