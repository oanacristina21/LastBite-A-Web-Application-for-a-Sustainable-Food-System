import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === "GET") {
    const categorii = await prisma.cATEGORIE.findMany();
    return res.status(200).json(categorii);
  }

  if (req.method === "POST") {
    const { denumire } = req.body;
    const noua = await prisma.cATEGORIE.create({
      data: { Denumire: denumire },
    });
    return res.status(201).json(noua);
  }

  if (req.method === "PUT") {
    const { id, denumire } = req.body;
    const actualizata = await prisma.cATEGORIE.update({
      where: { IdCategorie: id },
      data: { Denumire: denumire },
    });
    return res.status(200).json(actualizata);
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    await prisma.cATEGORIE.delete({
      where: { IdCategorie: Number(id) },
    });
    return res.status(200).json({ mesaj: "Șters cu succes" });
  }

  try {
    const categorii = await prisma.cATEGORIE.findMany({
      select: {
        IdCategorie: true,
        Denumire: true,
      },
    });

    return res.status(200).json(categorii);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mesaj: 'Eroare la încărcare categorii.' });
  }
}
