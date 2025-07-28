// pages/api/categorii.ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const categorii = await prisma.cATEGORIE.findMany();
    return res.status(200).json(categorii);
  }

  if (req.method === 'POST') {
    const { denumire } = req.body;
    if (!denumire) return res.status(400).json({ mesaj: 'Denumire lipsă' });

    const nouaCategorie = await prisma.cATEGORIE.create({
      data: { Denumire: denumire }
    });

    return res.status(201).json(nouaCategorie);
  }

  if (req.method === 'PUT') {
    const { id, denumire } = req.body;
    if (!id || !denumire) return res.status(400).json({ mesaj: 'Date invalide' });

    const categorie = await prisma.cATEGORIE.update({
      where: { IdCategorie: parseInt(id) },
      data: { Denumire: denumire }
    });

    return res.status(200).json(categorie);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id || Array.isArray(id)) return res.status(400).json({ mesaj: 'ID invalid' });

    await prisma.cATEGORIE.delete({
      where: { IdCategorie: parseInt(id) }
    });

    return res.status(200).json({ mesaj: 'Categorie ștearsă' });
  }

  return res.status(405).json({ mesaj: 'Metodă nepermisă' });
}
