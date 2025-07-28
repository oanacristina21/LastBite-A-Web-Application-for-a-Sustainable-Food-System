import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { cod } = req.query;

  if (typeof cod !== 'string') {
    return res.status(400).json({ mesaj: 'Cod invalid' });
  }

  const comanda = await prisma.cOMANDA.findFirst({
    where: { CodRidicare: cod },
    select: {
      NrComanda: true,
      StatusComanda: true,
      CodRidicare: true,
    }
  });

  if (!comanda) {
    return res.status(404).json({ mesaj: 'Comandă inexistentă' });
  }

  return res.status(200).json(comanda);
}
