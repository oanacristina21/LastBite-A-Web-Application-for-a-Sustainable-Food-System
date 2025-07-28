import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/authMiddleware';
import { trimiteEmailCodRidicare } from '@/lib/email'; // asigură-te că ai exportul
import { trimiteEmailConfirmareComanda } from '@/lib/email';



const prisma = new PrismaClient();

// Exemplu de funcție care generează mesajul notificării, poți adapta după implementarea ta
function getMesajNotificare(status: string, nrComanda: string, codRidicare?: string): string {
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ mesaj: 'Token lipsă' });

  const user = verifyToken(token);
  if (!user) return res.status(401).json({ mesaj: 'Token invalid' });

  const comandaId = Number(req.query.id);
  if (isNaN(comandaId)) return res.status(400).json({ mesaj: 'ID invalid' });

  if (req.method === 'PATCH') {
    const { status } = req.body;

    try {
      // verificăm dacă utilizatorul este restaurant
      const restaurant = await prisma.rESTAURANT.findUnique({
        where: { IdUtilizator: user.id }
      });

      if (!restaurant) return res.status(403).json({ mesaj: 'Acces interzis' });

      const comanda = await prisma.cOMANDA.findUnique({
        where: { IdComanda: comandaId }
      });

      if (!comanda || comanda.IdRestaurant !== restaurant.IdRestaurant) {
        return res.status(403).json({ mesaj: 'Nu ai dreptul să modifici această comandă' });
      }

      // actualizează statusul comenzii
      const comandaActualizata = await prisma.cOMANDA.update({
        where: { IdComanda: comandaId },
        data: { StatusComanda: status }
      });

      // creează notificarea pentru client
      const mesajClient = getMesajNotificare(
  status,
  comandaActualizata.NrComanda,
  comandaActualizata.CodRidicare || ''
);


      await prisma.nOTIFICARE.create({
  data: {
    Mesaj: mesajClient,
    IdComanda: comandaId,
    Destinatar: 'client',
    DataOraNotificare: new Date(),
  },
});

if (status === 'Gata de Ridicare') {
  const utilizator = await prisma.uTILIZATOR.findUnique({
    where: { IdUtilizator: comandaActualizata.IdClient },
    select: {
      Email: true,
      CLIENT: { select: { Prenume: true } },
    },
  });

  if (utilizator?.Email) {
    await trimiteEmailCodRidicare(
      utilizator.Email,
      utilizator.CLIENT?.Prenume ?? 'client',
      comandaActualizata.NrComanda,
      comandaActualizata.CodRidicare ?? ''  
    );
  }
}
if (status === 'Confirmata') {
  const utilizator = await prisma.uTILIZATOR.findUnique({
    where: { IdUtilizator: comandaActualizata.IdClient },
    select: {
      Email: true,
      CLIENT: { select: { Prenume: true } },
    },
  });

  if (utilizator?.Email) {
    await trimiteEmailConfirmareComanda(
      utilizator.Email,
      utilizator.CLIENT?.Prenume ?? 'client',
      comandaActualizata.NrComanda
    );
  }
}





      return res.status(200).json({ mesaj: 'Status actualizat și notificare trimisă' });
    } catch (error) {
      console.error('Eroare la actualizarea comenzii:', error);
      return res.status(500).json({ mesaj: 'Eroare internă' });
    }
  }

  return res.status(405).json({ mesaj: 'Metodă neacceptată' });
}
