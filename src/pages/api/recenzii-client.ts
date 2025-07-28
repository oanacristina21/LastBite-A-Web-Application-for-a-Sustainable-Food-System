import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getUserFromRequest } from '@/lib/authHelpers'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = getUserFromRequest(req)
  if (!user) return res.status(401).json({ mesaj: 'Neautentificat' })

  if (req.method === 'POST') {
    const { idComanda, mesaj, rating } = req.body

    if (!idComanda || typeof rating !== 'number') {
      return res.status(400).json({ mesaj: 'Date invalide' })
    }

    const comanda = await prisma.cOMANDA.findFirst({
      where: {
        IdComanda: idComanda,
        IdClient: user.id,
      },
    })

    if (!comanda) return res.status(403).json({ mesaj: 'Nu ai acces la această comandă' })

    const existenta = await prisma.rECENZIE.findUnique({
      where: { IdComanda: idComanda },
    })

    if (existenta) {
      return res.status(409).json({ mesaj: 'Ai trimis deja o recenzie pentru această comandă.' })
    }

    try {
const recenzie = await prisma.rECENZIE.create({
  data: {
    IdComanda: idComanda,
    MesajClient: mesaj,
    Rating: rating,
    DataRecenzie: new Date(),
  },
})

const comandaCuRestaurant = await prisma.cOMANDA.findUnique({
  where: { IdComanda: idComanda },
  include: {
    RESTAURANT: true,
    CLIENT: {
      select: { Nume: true, Prenume: true }
    }
  },
})

if (comandaCuRestaurant) {
  const clientNume = `${comandaCuRestaurant.CLIENT.Prenume} ${comandaCuRestaurant.CLIENT.Nume}`

  await prisma.nOTIFICARE.create({
    data: {
      Mesaj: `Ai primit o recenzie nouă de la ${clientNume}.`,
      Destinatar: 'restaurant',
      IdComanda: idComanda,
      DataOraNotificare: new Date(),
    },
  })
}


      return res.status(201).json({ mesaj: 'Recenzie adăugată cu succes', recenzie })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ mesaj: 'Eroare la salvarea recenziei' })
    }
  }

  return res.status(405).json({ mesaj: 'Metodă neacceptată' })
}
