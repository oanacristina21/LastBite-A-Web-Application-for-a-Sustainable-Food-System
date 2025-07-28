import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/authMiddleware';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ mesaj: 'Token lipsă' });

  const user = verifyToken(token);
  if (!user) return res.status(401).json({ mesaj: 'Token invalid sau expirat' });

  // Verificare stoc
const stocuri = await prisma.sTOC.findMany({
  where: {
    IdProdus: req.body.IdProdus,
    Cant_Disp: { gt: 0 },

  }
});

if (stocuri.length === 0) {
  return res.status(400).json({ mesaj: 'Produsul nu are stoc activ. Adaugă mai întâi stoc.', redirect: '/adauga-stoc' });
}


  if (req.method === 'POST') {
    const { IdProdus, DataInceput, DataSfarsit, Reducere } = req.body;
    if (!IdProdus || !DataSfarsit || !Reducere) {
    return res.status(400).json({ mesaj: 'Date incomplete' });
  }


    const produs = await prisma.pRODUS.findUnique({
  where: { IdProdus },
  select: { Pret_Initial: true },
});

if (!produs) {
  return res.status(404).json({ mesaj: 'Produsul nu a fost găsit.' });
}

if (Number(Reducere) > Number(produs.Pret_Initial)) {
  return res.status(400).json({ mesaj: 'Reducerea nu poate fi mai mare decât prețul produsului.' });
}

    

    try {
      const oferta = await prisma.oFERTA.create({
        data: {
          IdProdus,
          IdRestaurant: user.id,
          DataInceput: new Date(DataInceput), // bun!
    DataSfarsit: new Date(DataSfarsit), // bun!
          Reducere: Number(Reducere),
        },
      });

      return res.status(201).json({ mesaj: 'Ofertă creată', oferta });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ mesaj: 'Eroare internă' });
    }
  }

  if (req.method === 'GET') {
    const oferte = await prisma.oFERTA.findMany({
      where: {
        DataInceput: { lte: new Date() },
        DataSfarsit: { gte: new Date() },
      },
      include: {
        PRODUS: true,
      },
    });

    return res.status(200).json(oferte);
  }

  return res.status(405).end();
}
