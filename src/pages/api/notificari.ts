// pages/api/notificari.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/authMiddleware'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = req.cookies?.token
    if (!token) return res.status(401).json({ mesaj: 'Token lipsă' })

    const user = verifyToken(token) as { id: number, tip: string, clientId?: number, restaurantId?: number }
    if (!user) return res.status(401).json({ mesaj: 'Token invalid' })

    const where = user.tip === 'client'
      ? { Destinatar: 'client', Citita: false, COMANDA: { IdClient: user.clientId } }
      : { Destinatar: 'restaurant', Citita: false, COMANDA: { IdRestaurant: user.restaurantId } }

    const notificari = await prisma.nOTIFICARE.findMany({
      where,
      orderBy: { DataOraNotificare: 'desc' },
    })

    return res.status(200).json(notificari)
  } catch (error) {
    console.error('Eroare la preluarea notificărilor:', error)
    return res.status(500).json({ mesaj: 'Eroare internă la server' })
  }
}
