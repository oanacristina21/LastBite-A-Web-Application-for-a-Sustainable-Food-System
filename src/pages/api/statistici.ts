// /pages/api/statistici.ts
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'



const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const meseSalvate = await prisma.cOMANDA.count({
      where: { StatusComanda: 'finalizata' },
    })

    const restaurante = await prisma.rESTAURANT.count()

    const comenzi = await prisma.cOMANDA_PRODUS.findMany({
      where: {
        PretFinal: { not: null },
      },
      include: {
        PRODUS: true,
      },
    })

    // Calculează media reducerii în procente
    const reduceri = comenzi.map((c) => {
      const pretInitial = parseFloat(c.PRODUS.Pret_Initial.toString())
      const pretFinal = parseFloat(c.PretFinal?.toString() ?? '0')
      return pretInitial > 0 ? 1 - pretFinal / pretInitial : 0
    }).filter(x => x > 0)

    const reducereMedie = reduceri.length
      ? Math.round((reduceri.reduce((a, b) => a + b, 0) / reduceri.length) * 100)
      : 0

    const co2Economisit = (meseSalvate * 2.1 / 1000).toFixed(1) // tone

    res.status(200).json({
      meseSalvate,
      restaurante,
      reducereMedie,
      co2Economisit,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Eroare la extragerea statisticilor' })
  }
}
