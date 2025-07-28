// pages/api/notificari/mark-read.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') return res.status(405).end()
  const { id } = req.body  // { id: number }

  try {
    await prisma.nOTIFICARE.update({
      where: { IdNotificare: Number(id) },
      data: { Citita: true },
    })
    res.status(200).json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Eroare la marcarea notificării' })
  }
}
