import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const preferinte = await prisma.pREFERINTE_DIETETICE.findMany();
    return res.status(200).json(preferinte);
  }

  if (req.method === "POST") {
    const { denumire } = req.body;
    const noua = await prisma.pREFERINTE_DIETETICE.create({
      data: { Denumire: denumire },
    });
    return res.status(201).json(noua);
  }

  if (req.method === "PUT") {
    const { id, denumire } = req.body;
    const actualizata = await prisma.pREFERINTE_DIETETICE.update({
      where: { IdPreferintaDietetica: id },
      data: { Denumire: denumire },
    });
    return res.status(200).json(actualizata);
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    await prisma.pREFERINTE_DIETETICE.delete({
      where: { IdPreferintaDietetica: Number(id) },
    });
    return res.status(200).json({ mesaj: "Șters cu succes" });
  }

  try {
    const preferinte = await prisma.pREFERINTE_DIETETICE.findMany({
      select: {
        IdPreferintaDietetica: true,
        Denumire: true,
      },
    });

    return res.status(200).json(preferinte);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mesaj: 'Eroare la încărcare preferințe.' });
  }
}
