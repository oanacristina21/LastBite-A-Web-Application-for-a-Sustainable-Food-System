/**
 * @swagger
 * /api/comenzi:
 *   get:
 *     summary: Obține toate comenzile
 *     responses:
 *       200:
 *         description: Lista comenzilor
 */

import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/authMiddleware';
import { trimiteEmailComanda } from '@/lib/email';
import { StatusComanda } from '@/lib/types';


const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ mesaj: 'Token lipsă' });

  const user = verifyToken(token);
  if (!user) return res.status(401).json({ mesaj: 'Token invalid sau expirat' });

  const utilizator = await prisma.uTILIZATOR.findUnique({
    where: { IdUtilizator: user.id },
    select: {
      Email: true,
      CLIENT: {
        select: {
          Prenume: true,
        },
      },
    },
  });

  if (req.method === 'GET') {
    try {
      
      const comenzi = await prisma.cOMANDA.findMany({
  where: {
    IdClient: user.id,
  },
  include: {
    COMANDA_PRODUS: {
      include: {
        PRODUS: {
          include: {
            OFERTA: {
              where: {
                DataSfarsit: { gte: new Date() },
              },
              select: {
                DataInceput: true,
                DataSfarsit: true,
              },
            },
          },
        },
      },
    },
    RECENZIE: true,
    RESTAURANT: {
      select: {
              Denumire: true,
      Adresa: true,
      Latitude: true,
      Longitude: true
      },
    },
  },
  orderBy: { DataComanda: 'desc' },
});
const rezultat = comenzi.map((c) => ({
  IdComanda: c.IdComanda,
  NrComanda: c.NrComanda,
  DataComanda: c.DataComanda,
  StatusComanda: c.StatusComanda,
  COMANDA_PRODUS: c.COMANDA_PRODUS,
  RECENZIE: c.RECENZIE ?? null,
  RESTAURANT: {
    Denumire: c.RESTAURANT?.Denumire ?? 'Necunoscut',
    Adresa: c.RESTAURANT?.Adresa ?? '',
    Latitude: c.RESTAURANT?.Latitude ?? null,
    Longitude: c.RESTAURANT?.Longitude ?? null,
  }
}));


      return res.status(200).json(rezultat);
    } catch (error) {
      console.error('Eroare la listarea comenzilor:', error);
      return res.status(500).json({ mesaj: 'Eroare internă' });
    }
  }

  if (req.method === 'POST') {
    const { produse }: { produse: { id: number; cantitate: number }[] } = req.body;
    if (!Array.isArray(produse) || produse.length === 0) {
      return res.status(400).json({ mesaj: 'Lista de produse este invalidă sau goală.' });
    }

    try {
      const primulProdus = await prisma.pRODUS.findUnique({ where: { IdProdus: produse[0].id } });
      if (!primulProdus) return res.status(400).json({ mesaj: 'Produs inexistent.' });
      const idRestaurant = primulProdus.IdRestaurant;

      console.log('Id restaurant pentru comanda:', idRestaurant);
      const restaurant = await prisma.rESTAURANT.findUnique({
  where: { IdRestaurant: idRestaurant },
  select: { Adresa: true },
});

if (!restaurant) {
  return res.status(404).json({ mesaj: 'Restaurantul nu a fost găsit' });
}



// exemplu de utilizare
function getMesajNotificare(status: StatusComanda, nrComanda: string, codRidicare?: string): string {
  switch (status) {
    case 'Plasata':
      return `Comanda ta cu numărul ${nrComanda} a fost plasată cu succes.`;
    case 'Confirmata':
      return `Comanda ta cu numărul ${nrComanda} a fost confirmată de restaurant.`;
    case 'In Pregatire':
      return `Comanda ta cu numărul ${nrComanda} este în pregătire.`;
    case 'Gata de Ridicare':
      return `Comanda ta cu numărul ${nrComanda} este gata de ridicat. Cod ridicare: ${codRidicare || 'N/A'}`;
    case 'Finalizata':
      return `Comanda ta cu numărul ${nrComanda} a fost finalizată. Mulțumim că ai folosit serviciile noastre!`;
    case 'Anulata':
      return `Comanda ta cu numărul ${nrComanda} a fost anulată.`;
    default:
      return `Status necunoscut pentru comanda ta ${nrComanda}.`;
  }
}



      // Definește statusul inițial corect
const noulStatus: StatusComanda = 'Plasata';
      const comanda = await prisma.cOMANDA.create({
        data: {
          NrComanda: `CMD-${Date.now()}`,
          CodRidicare: `RID-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          DataComanda: new Date(),
          StatusComanda: noulStatus,
          AdresaColectare: restaurant.Adresa,
          IdClient: user.id,
          IdRestaurant: idRestaurant,
        },
      });

      // Notificare pentru restaurant
      await prisma.nOTIFICARE.create({
        data: {
          Mesaj: `Ai primit o nouă comandă cu ID-ul ${comanda.NrComanda}.`,
          IdComanda: comanda.IdComanda,
          Destinatar: 'restaurant',
          DataOraNotificare: new Date()
        },
      });

      // Notificare pentru client cu mesaj generat
      const mesajClient = getMesajNotificare(noulStatus, comanda.NrComanda, comanda.CodRidicare ?? undefined);
      await prisma.nOTIFICARE.create({
        data: {
          Mesaj: mesajClient,
          IdComanda: comanda.IdComanda,
          Destinatar: 'client',
          DataOraNotificare: new Date()
        },
      });

      await trimiteEmailComanda(
        utilizator?.Email || '',
        'Confirmare Comandă - LastBite',
        `
          <h3>Bună, ${utilizator?.CLIENT?.Prenume || 'client'}!</h3>
          <p>Comanda ta a fost plasată cu succes pe LastBite.</p>
          <p><strong>ID Comandă:</strong> ${comanda.NrComanda}</p>
          <p>Vom reveni când comanda este în curs de pregătire.</p>
          <br />
          <p>Mulțumim că salvezi mâncarea!</p>
        `
      );

      // Restul logicii pentru produse, stocuri etc. rămâne neschimbată
      for (const produs of produse) {
        const stocuri = await prisma.sTOC.findMany({
          where: {
            IdProdus: produs.id,
            DataValab: { gte: new Date() },
            Cant_Disp: { gt: 0 },
          },
          orderBy: { DataValab: 'asc' },
        });

        const totalDisponibil = stocuri.reduce((sum, s) => sum + s.Cant_Disp, 0);
        if (produs.cantitate > totalDisponibil) {
          return res.status(400).json({
            mesaj: `Stoc insuficient pentru produsul cu id ${produs.id}. Disponibil: ${totalDisponibil}`,
          });
        }

        const oferta = await prisma.oFERTA.findFirst({
          where: {
            IdProdus: produs.id,
            DataInceput: { lte: new Date() },
            DataSfarsit: { gte: new Date() },
          },
        });

        const detaliiProdus = await prisma.pRODUS.findUnique({
          where: { IdProdus: produs.id },
        });

        if (!detaliiProdus) continue;

        const pretInitial = Number(detaliiProdus.Pret_Initial);
        const reducere = oferta ? Number(oferta.Reducere) : 0;
        const pretFinal = Math.max(pretInitial - reducere, 0);

        await prisma.cOMANDA_PRODUS.create({
          data: {
            IdComanda: comanda.IdComanda,
            IdProdus: produs.id,
            CantitateComandata: produs.cantitate,
            PretFinal: pretFinal,
          },
        });

        let cantitateRamasa = produs.cantitate;
        for (const stoc of stocuri) {
          if (cantitateRamasa <= 0) break;

          const deScazut = Math.min(cantitateRamasa, stoc.Cant_Disp);
          await prisma.sTOC.update({
            where: { IdStoc: stoc.IdStoc },
            data: { Cant_Disp: stoc.Cant_Disp - deScazut },
          });

          cantitateRamasa -= deScazut;
        }
      }

      return res.status(201).json({ id: comanda.IdComanda });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ mesaj: 'Eroare la plasarea comenzii' });
    }
  }

  return res.status(405).json({ mesaj: 'Metodă neacceptată' });
}
