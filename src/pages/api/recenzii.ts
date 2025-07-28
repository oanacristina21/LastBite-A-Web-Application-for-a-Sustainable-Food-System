import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromRequest } from '@/lib/authHelpers';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = getUserFromRequest(req);
  if (!user) return res.status(401).json({ mesaj: 'Neautentificat' });

  const restaurant = await prisma.rESTAURANT.findUnique({
    where: { IdUtilizator: user.id },
  });

  if (!restaurant) return res.status(403).json({ mesaj: 'Nu ești restaurant.' });

  if (req.method === 'GET') {
    try {
      const recenzii = await prisma.rECENZIE.findMany({
  where: {
    COMANDA: {
      IdRestaurant: restaurant?.IdRestaurant,
    },
  },
  include: {
    COMANDA: {
      include: {
        CLIENT: { select: { Nume: true, Prenume: true } }
      }
    },
  },
  orderBy: { DataRecenzie: 'desc' },
});

      const rezultat = recenzii.map((r) => ({
        IdRecenzie: r.IdRecenzie,
        MesajClient: r.MesajClient,
        Rating: r.Rating,
        DataRecenzie: r.DataRecenzie,
        RaspunsRestaurant: r.RaspunsRestaurant,
        NumeClient: r.COMANDA.CLIENT ? `${r.COMANDA.CLIENT.Prenume} ${r.COMANDA.CLIENT.Nume}` : 'Client',
        IdComanda: r.IdComanda,
      }));

      return res.status(200).json(rezultat);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ mesaj: 'Eroare la încărcarea recenziilor' });
    }
  }

  if (req.method === 'PATCH') {
    const { IdRecenzie, RaspunsRestaurant } = req.body;

    if (!IdRecenzie || !RaspunsRestaurant) {
      return res.status(400).json({ mesaj: 'Date lipsă pentru răspuns.' });
    }

    try {
      const update = await prisma.rECENZIE.update({
        where: { IdRecenzie },
        data: { RaspunsRestaurant },
      });
      const recenzie = await prisma.rECENZIE.findUnique({
  where: { IdRecenzie },
  include: {
    COMANDA: {
      include: {
        CLIENT: {
          select: {
            IdUtilizator: true,
            Prenume: true,
            Nume: true,
          },
        },
        RESTAURANT: {
          select: {
            Denumire: true,
          },
        },
      },
    },
  },
});
if (recenzie && recenzie.COMANDA && recenzie.COMANDA.CLIENT) {
  await prisma.nOTIFICARE.create({
  data: {
    Mesaj: `Restaurantul ${recenzie.COMANDA.RESTAURANT?.Denumire || 'restaurantul'} a răspuns la recenzia ta: „${RaspunsRestaurant}”`,
    IdComanda: recenzie.IdComanda,
    Destinatar: 'client',
    DataOraNotificare: new Date(),
  },
});

}


      return res.status(200).json({ mesaj: 'Răspuns salvat', update });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ mesaj: 'Eroare la salvarea răspunsului.' });
    }
  }

  return res.status(405).json({ mesaj: 'Metodă nepermisă' });
}
