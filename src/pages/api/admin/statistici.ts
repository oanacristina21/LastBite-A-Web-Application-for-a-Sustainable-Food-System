import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const totalUtilizatori = await prisma.uTILIZATOR.count();
    const totalRestaurante = await prisma.rESTAURANT.count();
    const totalProduse = await prisma.sTOC.aggregate({
      _sum: { Cant_Disp: true },
    });

    const oferteActive = await prisma.oFERTA.findMany({
      where: { DataSfarsit: { gt: new Date() } },
      include: {
        PRODUS: {
          include: {
            STOC: true,
          },
        },
      },
    });

   const comenziFinalizate = await prisma.cOMANDA.findMany({
  where: { StatusComanda: 'Finalizata' },
  include: { 
    COMANDA_PRODUS: {
      select: {
        PretFinal: true,
        CantitateComandata: true,
      },
    },
  },
});

const totalValoare = comenziFinalizate.reduce((total, comanda) => {
  const suma = comanda.COMANDA_PRODUS.reduce((sum: number, p) => {
    const pret = parseFloat(p.PretFinal?.toString() || "0");
    const cant = parseInt(p.CantitateComandata?.toString() || "0");
    if (isNaN(pret) || isNaN(cant)) return sum;
    return sum + pret * cant;
  }, 0);
  return total + suma;
}, 0);




    return res.status(200).json({
      utilizatori: totalUtilizatori,
      restaurante: totalRestaurante,
      produse: totalProduse._sum?.Cant_Disp || 0,
      oferte: oferteActive.length,
      economii: totalValoare,
    });

  } catch (e) {
    console.error("Eroare în /api/admin/statistici:", e);
    return res.status(500).json({ mesaj: "Eroare la statistici" });
  }
}
