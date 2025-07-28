// pages/api/notificari/mark-read-all.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/authMiddleware'

const prisma = new PrismaClient()
type User = {
  id: number;
  tip: 'client' | 'restaurant' | 'admin';
  clientId?: number;
  restaurantId?: number;
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') return res.status(405).end()
  const token = req.cookies?.token
  if (!token) return res.status(401).json({ mesaj: 'Token lipsă' })
  const user = verifyToken(token) as User
  if (!user) return res.status(401).json({ mesaj: 'Token invalid' })

  const where = user.tip === 'client'
    ? { Destinatar: 'client', Citita: false, COMANDA: { IdClient: user.clientId } }
    : { Destinatar: 'restaurant', Citita: false, COMANDA: { IdRestaurant: user.restaurantId } }

  await prisma.nOTIFICARE.updateMany({
    where,
    data: { Citita: true },
  })

  return res.status(200).json({ success: true })
}
