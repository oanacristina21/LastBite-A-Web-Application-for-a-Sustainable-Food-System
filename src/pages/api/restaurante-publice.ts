// pages/api/restaurante-publice.ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ mesaj: 'Metodă nepermisă' });

  try {
    const now = new Date();

const restaurante = await prisma.rESTAURANT.findMany({
  include: {
    UTILIZATOR: true,
    OFERTE: {
      where: {
        AND: [
          { DataInceput: { lte: now } },
          { DataSfarsit: { gte: now } },
        ],
      },
    },
    COMENZI: {
      include: {
        RECENZIE: true,
      },
    },
  },
});


const rezultate = restaurante.map((r) => {
  const toateRatingurile = r.COMENZI
    .map((c) => c.RECENZIE?.Rating)
    .filter((r): r is number => r !== undefined && r !== null);

  const ratingMediu =
    toateRatingurile.length > 0
      ? (toateRatingurile.reduce((a, b) => a + b, 0) / toateRatingurile.length).toFixed(1)
      : null;

  return {
    IdRestaurant: r.IdRestaurant,
    Denumire: r.Denumire,
    Adresa: r.Adresa,
    Telefon: r.UTILIZATOR?.Nr_Telefon ?? "N/A",
    NrOferteActive: r.OFERTE.length,
    Rating: ratingMediu,
  };
});


return res.status(200).json(rezultate);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ mesaj: 'Eroare la obținerea restaurantelor' });
  }
}
