import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';





const prisma = new PrismaClient();
function calcHaversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  const {
    categorie,
    preferinte,
    pretMin,
    pretMax,
    sortBy,
    sortDir,
    restaurantId,
  } = req.query;


  const now = new Date();
  const todayMidnight = new Date(now.setHours(0, 0, 0, 0));
  const userLat = parseFloat(req.query.lat as string);
const userLng = parseFloat(req.query.lng as string);
const maxDist = parseFloat(req.query.dist as string); // km



  try {
    const produseRaw = await prisma.pRODUS.findMany({
      where: {
       ...(restaurantId && Number(restaurantId) && {
    IdRestaurant: Number(restaurantId),
  }),

        ...(categorie && { IdCategorie: Number(categorie) }),

        ...(preferinte
          ? {
              PRODUS_PREFERINTA: {
                some: {
                  IdPreferintaDietetica: {
                    in: preferinte.toString().split(',').map(Number),
                  },
                },
              },
            }
          : {}),

        DataExpirare: { gt: new Date() },
        OFERTA: {
          some: {
            DataInceput: { lte: new Date() },
            DataSfarsit: { gte: new Date() },
          },
        },
        STOC: {
          some: {
            Cant_Disp: { gt: 0 },
            DataValab: { gt: todayMidnight },
          },
        },
      },
      include: {
        STOC: true,
        OFERTA: {
          where: {
            DataInceput: { lte: new Date() },
            DataSfarsit: { gte: new Date() },
          },
        },
        RESTAURANT: {
  select: {
    Denumire: true,
    Latitude: true,
    Longitude: true,
    Adresa: true,
    LOCALITATE: {
      select: {
        Denumire: true,
        JUDET: {
          select: {
            Denumire: true,
          }
        }
      }
    }
  }
},

        
        PRODUS_PREFERINTA: {
      include: {
        PREFERINTE_DIETETICE: true,
      },
    },
      },
    });

    let produse = produseRaw.map(p => {
  const reducere = p.OFERTA?.[0]?.Reducere || 0;
  const pretRedus = Number(p.Pret_Initial) - Number(reducere);
  const distantaKm = userLat && userLng && p.RESTAURANT?.Latitude && p.RESTAURANT?.Longitude
    ? calcHaversine(userLat, userLng, p.RESTAURANT.Latitude, p.RESTAURANT.Longitude)
    : null;

  return {
    IdProdus: p.IdProdus,
    Denumire: p.Denumire,
    Pret_Initial: Number(p.Pret_Initial),
    _pretRedus: pretRedus,
    Descriere: p.Descriere ?? '',
    Imagine: p.Imagine || '',
    OFERTA: p.OFERTA.map(o => ({
      Reducere: Number(o.Reducere),
      DataSfarsit: o.DataSfarsit,
    })),
    CantitateDisponibila: p.STOC.reduce((acc, stoc) => acc + stoc.Cant_Disp, 0),
    RESTAURANT: {
  Denumire: p.RESTAURANT?.Denumire ?? 'Necunoscut',
  Latitude: p.RESTAURANT?.Latitude ?? null,
  Longitude: p.RESTAURANT?.Longitude ?? null,
  Adresa: p.RESTAURANT?.Adresa ?? '',
  Localitate: p.RESTAURANT?.LOCALITATE?.Denumire ?? '',
  Judet: p.RESTAURANT?.LOCALITATE?.JUDET?.Denumire ?? '',
},

    IdRestaurant: p.IdRestaurant,
    Preferinte: p.PRODUS_PREFERINTA.map(pp => pp.PREFERINTE_DIETETICE?.Denumire).filter(Boolean),
    DistantaKm: distantaKm,
  };
});

    produse = produse.filter(p => {
      const min = pretMin ? Number(pretMin) : null;
      const max = pretMax ? Number(pretMax) : null;
      return (!min || p._pretRedus >= min) && (!max || p._pretRedus <= max);
    });
if (!isNaN(userLat) && !isNaN(userLng) && !isNaN(maxDist)) {
  produse = produse.filter(p => {
    const lat = p.RESTAURANT?.Latitude;
    const lng = p.RESTAURANT?.Longitude;

    if (lat !== null && lng !== null) {
      const dist = calcHaversine(userLat, userLng, lat, lng);
      return dist <= maxDist;
    }

    return false;
  });
}


    if (sortBy === 'pret') {
      produse.sort((a, b) =>
        sortDir === 'desc'
          ? b._pretRedus - a._pretRedus
          : a._pretRedus - b._pretRedus
      );
    }
    if (sortBy === 'distanta') {
  produse.sort((a, b) => {
    if (a.DistantaKm == null) return 1;
    if (b.DistantaKm == null) return -1;
    return sortDir === 'desc'
      ? b.DistantaKm - a.DistantaKm
      : a.DistantaKm - b.DistantaKm;
  });
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const response = produse.map(({ _pretRedus: _, ...rest }) => rest);



    return res.status(200).json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mesaj: 'Eroare server' });
  }
}
