// GET: returnează toți utilizatorii cu rolul derivat
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const utilizatori = await prisma.uTILIZATOR.findMany({
      include: {
        CLIENT: true,
        RESTAURANT: true,
        ADMIN: true,
      },
    });

    const rezultat = utilizatori.map(u => {
      let tip: 'admin' | 'client' | 'restaurant' = 'client';

if (u.ADMIN) tip = 'admin';
else if (u.RESTAURANT) tip = 'restaurant';


      return {
        id: u.IdUtilizator,
        email: u.Email,
        telefon: u.Nr_Telefon,
        tip,
      };
    });

    return res.status(200).json(rezultat);
  }

 if (req.method === 'DELETE') {
  const { id } = req.query;
  if (!id || Array.isArray(id)) return res.status(400).json({ mesaj: 'ID invalid' });

  const userId = parseInt(id);

  // Caută tipul utilizatorului
  const utilizator = await prisma.uTILIZATOR.findUnique({
    where: { IdUtilizator: userId },
    include: {
      CLIENT: true,
      RESTAURANT: true,
      ADMIN: true,
    },
  });

  if (!utilizator) return res.status(404).json({ mesaj: 'Utilizator inexistent' });

  // Șterge întâi din tabelul corespunzător
  if (utilizator.CLIENT) {
    await prisma.cLIENT.delete({ where: { IdUtilizator: userId } });
  } else if (utilizator.RESTAURANT) {
    await prisma.rESTAURANT.delete({ where: { IdUtilizator: userId } });
  } else if (utilizator.ADMIN) {
    await prisma.aDMIN.delete({ where: { IdUtilizator: userId } });
  }

  // Apoi șterge din utilizator
  await prisma.uTILIZATOR.delete({
    where: { IdUtilizator: userId }
  });

  return res.status(200).json({ mesaj: 'Șters cu succes' });
}


  res.status(405).end();
}
