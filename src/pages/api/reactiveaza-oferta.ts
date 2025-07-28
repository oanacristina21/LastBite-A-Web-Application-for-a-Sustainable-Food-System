import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/authMiddleware';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ mesaj: 'Metodă nepermisă' });
  }

  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ mesaj: 'Token lipsă' });

  const user = verifyToken(token);
  if (!user) return res.status(401).json({ mesaj: 'Token invalid sau expirat' });

const {
  IdProdus,
  Reducere,
  DataInceput,
  DataSfarsit,
  Cant_Disp,
  DataProducere,
  DataExpirare
} = req.body;

  if (
  !IdProdus ||
  !Reducere ||
  !DataInceput ||
  !DataSfarsit ||
  !DataProducere ||
  !DataExpirare ||
  Cant_Disp === undefined
) {
  return res.status(400).json({ mesaj: 'Date incomplete pentru reactivare' });
}


  try {
    await prisma.oFERTA.deleteMany({
      where: { IdProdus },
    });

    const ofertaNoua = await prisma.oFERTA.create({
      data: {
        IdProdus,
        IdRestaurant: user.id,
        Reducere: Number(Reducere),
        DataInceput: new Date(DataInceput),
        DataSfarsit: new Date(DataSfarsit),
      },
    });

    await prisma.sTOC.updateMany({
  where: { IdProdus },
  data: {
    Cant_Disp: Number(Cant_Disp),
    DataValab: new Date(),
  },
});

await prisma.pRODUS.update({
  where: { IdProdus },
  data: {
    DataProducere: new Date(DataProducere),
    DataExpirare: new Date(DataExpirare),
  },
});



    return res.status(201).json({
      mesaj: 'Ofertă reactivată și stoc actualizat.',
      oferta: ofertaNoua,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mesaj: 'Eroare internă la reactivare' });
  }
}
