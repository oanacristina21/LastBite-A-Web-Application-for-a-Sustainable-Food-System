import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/authMiddleware';
import { trimiteEmailComanda } from '@/lib/email';

type ProdusValid = {
  produs: {
    id: number;
    cantitate: number;
    pret?: number;
    denumire?: string;
  };
  stocuri: {
    IdStoc: number;
    Cant_Disp: number;
    DataValab: Date;
  }[];
  pretFinal: number;
};


const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ mesaj: 'Token lipsă' });

  const user = verifyToken(token);
  if (!user || !user.id || !user.tip) {
    return res.status(401).json({ mesaj: 'Token invalid sau expirat' });
  }

  if (req.method === 'POST') {
    const { produse } = req.body;

    if (!Array.isArray(produse) || produse.length === 0) {
      return res.status(400).json({ mesaj: 'Lista de produse este invalidă sau goală.' });
    }

    try {
      const utilizator = await prisma.uTILIZATOR.findUnique({
        where: { IdUtilizator: user.id },
        select: {
          Email: true,
          CLIENT: { select: { Prenume: true } },
        },
      });

      const primulProdus = await prisma.pRODUS.findUnique({ where: { IdProdus: produse[0].id } });
      if (!primulProdus) return res.status(400).json({ mesaj: 'Produs inexistent.' });
      const idRestaurant = primulProdus.IdRestaurant;
      const restaurant = await prisma.rESTAURANT.findUnique({
  where: { IdRestaurant: idRestaurant },
  select: { Adresa: true },
});

if (!restaurant) {
  return res.status(404).json({ mesaj: 'Restaurantul nu a fost găsit' });
}
let totalComanda = 0;
const produseValide: ProdusValid[] = [];

for (const produs of produse) {
  const stocuri = await prisma.sTOC.findMany({
    where: {
      IdProdus: produs.id,
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

  const detaliiProdus = await prisma.pRODUS.findUnique({ where: { IdProdus: produs.id } });
  if (!detaliiProdus) continue;

  const pretInitial = Number(detaliiProdus.Pret_Initial);
  const reducere = oferta ? Number(oferta.Reducere) : 0;
  const pretFinal = Math.max(pretInitial - reducere, 0);

  totalComanda += pretFinal * produs.cantitate;
  produseValide.push({ produs, stocuri, pretFinal });
}

if (produseValide.length === 0 || totalComanda === 0) {
  return res.status(400).json({ mesaj: 'Comanda invalidă sau fără produse valabile' });
}



      const comanda = await prisma.cOMANDA.create({
        data: {
          NrComanda: `CMD-${Date.now()}`,
          CodRidicare: `RID-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          DataComanda: new Date(),
          StatusComanda: 'Plasata',
          AdresaColectare: restaurant.Adresa,
          IdClient: user.id,
          IdRestaurant: idRestaurant,
        },
      });
      await prisma.pLATA.create({
  data: {
    SumaTotala: produse.reduce((sum: number, p: { pret: number; cantitate: number }) => sum + p.pret * p.cantitate, 0),
    MetodaPlata: 'Stripe',
    Status_Plata: 'Platit',
    IdComanda: comanda.IdComanda,
    StripeSessionId: req.body.stripeSessionId || null, 
    StripePaymentId: req.body.stripePaymentId || null, 
  },
});


      await prisma.nOTIFICARE.createMany({
        data: [
          {
            Mesaj: `Ai primit o nouă comandă cu ID-ul ${comanda.NrComanda}.`,
            IdComanda: comanda.IdComanda,
            Destinatar: 'restaurant',
            DataOraNotificare: new Date(),
          },
          {
            Mesaj: `Comanda ta cu numărul ${comanda.NrComanda} a fost plasată cu succes.`,
            IdComanda: comanda.IdComanda,
            Destinatar: 'client',
            DataOraNotificare: new Date(),
          },
        ],
      });

      if (utilizator?.Email) {
        await trimiteEmailComanda(
          utilizator.Email,
          'Confirmare Comandă - LastBite',
          `<h3>Bună, ${utilizator.CLIENT?.Prenume || 'client'}!</h3>
          <p>Comanda ta cu ID <strong>${comanda.NrComanda}</strong> a fost plasată.</p>
          <br />Mulțumim că salvezi mâncarea!`
        );
      }
      console.log("📦 Produse primite în backend:", produse);
      for (const produs of produse) {
        const stocuri = await prisma.sTOC.findMany({
  where: {
    IdProdus: produs.id,
    Cant_Disp: { gt: 0 },
  },
  orderBy: { DataValab: 'asc' },
});


        const totalDisponibil = stocuri.reduce((sum, s) => sum + s.Cant_Disp, 0);
        console.log(`🧮 Total disponibil pentru produs ${produs.id}:`, totalDisponibil);

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

        const detaliiProdus = await prisma.pRODUS.findUnique({ where: { IdProdus: produs.id } });
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
        console.log(`🔍 Verific produs: ID=${produs.id}, cantitate=${produs.cantitate}`);
        for (const stoc of stocuri) {
          if (cantitateRamasa <= 0) break;
          const deScazut = Math.min(cantitateRamasa, stoc.Cant_Disp);
          await prisma.sTOC.update({
            where: { IdStoc: stoc.IdStoc },
            data: { Cant_Disp: stoc.Cant_Disp - deScazut },
          });
          cantitateRamasa -= deScazut;
        }
        console.log("📊 Stocuri găsite:", stocuri);

      }

      return res.status(201).json({ mesaj: 'Comandă finalizată cu succes' });
    } catch (err) {
      console.error('Eroare finalizare comandă (POST):', err);
      return res.status(500).json({ mesaj: 'Eroare internă' });
    }
  }

 if (req.method === 'PATCH') {
  const { cod } = req.query;

  if (user.tip !== 'restaurant') {
    return res.status(403).json({ mesaj: 'Doar restaurantele pot finaliza comenzi.' });
  }

  try {
    const comanda = await prisma.cOMANDA.findFirst({
  where: { CodRidicare: String(cod) },
  include: {
    CLIENT: {
      include: {
        UTILIZATOR: true,
      }
    }
  }
});

    if (!comanda) return res.status(404).json({ mesaj: 'Comandă inexistentă' });
    if (comanda.StatusComanda !== 'Gata de Ridicare') {
      return res.status(400).json({ mesaj: 'Comanda nu este gata pentru finalizare' });
    }

    await prisma.cOMANDA.update({
      where: { IdComanda: comanda.IdComanda },
      data: { StatusComanda: 'Finalizata' },
    });
    

    await prisma.nOTIFICARE.createMany({
      data: [
        {
          Mesaj: `Comanda ta cu ID-ul ${comanda.NrComanda} a fost finalizată.`,
          IdComanda: comanda.IdComanda,
          Destinatar: 'client',
          DataOraNotificare: new Date(),
        },
        {
          Mesaj: `Comanda ${comanda.NrComanda} a fost finalizată cu succes.`,
          IdComanda: comanda.IdComanda,
          Destinatar: 'restaurant',
          DataOraNotificare: new Date(),
        },
      ],
    });

   const emailClient = comanda.CLIENT?.UTILIZATOR?.Email;
const prenumeClient = comanda.CLIENT?.Prenume || 'client';



    if (emailClient) {
      await trimiteEmailComanda(
        emailClient,
        'Comandă Finalizată - LastBite',
        `<h3>Bună, ${prenumeClient}!</h3>
        <p>Comanda ta cu ID <strong>${comanda.NrComanda}</strong> a fost finalizată cu succes.</p>
        <p>Poftă bună și mulțumim că alegi să reduci risipa alimentară!</p>`
      );
    }

    return res.status(200).json({ mesaj: 'Comandă finalizată cu succes' });
  } catch (err) {
    console.error('Eroare la finalizarea comenzii (PATCH):', err);
    return res.status(500).json({ mesaj: 'Eroare la finalizare' });
  }
}


  // Default: method not allowed
  return res.status(405).json({ mesaj: 'Metodă neacceptată' });
}
