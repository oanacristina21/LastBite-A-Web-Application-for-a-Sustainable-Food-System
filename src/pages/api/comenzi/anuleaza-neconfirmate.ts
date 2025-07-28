import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ mesaj: 'Doar GET este permis' });
  }

  try {
    const treizeciMinInMs = 30 * 60 * 1000;
    const limita = new Date(Date.now() - treizeciMinInMs);

    // Găsește comenzile care sunt neconfirmate și mai vechi de 30 minute
    const comenziDeAnulat = await prisma.cOMANDA.findMany({
      where: {
        StatusComanda: 'Plasata',
        DataComanda: { lt: limita },
      },
    });

    const iduriAnulate: number[] = [];

    for (const comanda of comenziDeAnulat) {
      await prisma.cOMANDA.update({
        where: { IdComanda: comanda.IdComanda },
        data: { StatusComanda: 'Anulata' },
      });

      await prisma.nOTIFICARE.create({
        data: {
          IdComanda: comanda.IdComanda,
          Mesaj: `Comanda ${comanda.NrComanda} a fost anulată automat pentru că nu a fost confirmată în 30 de minute.`,
          Destinatar: 'client',
          DataOraNotificare: new Date(),
        },
      });

      iduriAnulate.push(comanda.IdComanda);
    }

    return res.status(200).json({ mesaj: 'Comenzi anulate automat', comenzi: iduriAnulate });
  } catch (err) {
    console.error('Eroare la anulare automată:', err);
    return res.status(500).json({ mesaj: 'Eroare internă' });
  }
}
