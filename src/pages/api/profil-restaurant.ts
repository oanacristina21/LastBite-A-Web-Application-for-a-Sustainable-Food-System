import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getUserFromRequest } from '@/lib/authHelpers'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = getUserFromRequest(req)
  if (!user) return res.status(401).json({ mesaj: 'Neautentificat' })

  if (req.method === 'GET') {
    try {
      const restaurant = await prisma.rESTAURANT.findUnique({
        where: { IdUtilizator: user.id },
        include: {
          UTILIZATOR: { select: { Nr_Telefon: true, Email: true } },
        },
      })

      if (!restaurant) return res.status(404).json({ mesaj: 'Restaurant inexistent' })

      return res.status(200).json({
        denumire: restaurant.Denumire,
        adresa: restaurant.Adresa,
        nrTelefon: restaurant.UTILIZATOR.Nr_Telefon,
        email: restaurant.UTILIZATOR.Email,
      })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ mesaj: 'Eroare la preluarea profilului' })
    }
  }

  if (req.method === 'PATCH') {
    const { denumire, adresa, nrTelefon, email, parolaNoua } = req.body

    if (!denumire || !adresa || !nrTelefon || !email)
      return res.status(400).json({ mesaj: 'Toate câmpurile sunt obligatorii' })

    try {
      await prisma.rESTAURANT.update({
        where: { IdUtilizator: user.id },
        data: { Denumire: denumire, Adresa: adresa },
      })

      const updateData: Partial<{ Nr_Telefon: string; Email: string; Parola?: string }> = {
        Nr_Telefon: nrTelefon,
        Email: email,
      }

      if (parolaNoua && parolaNoua.length >= 6) {
        const salt = await bcrypt.genSalt(10)
        const parolaHashed = await bcrypt.hash(parolaNoua, salt)
        updateData.Parola = parolaHashed
      }

      await prisma.uTILIZATOR.update({
        where: { IdUtilizator: user.id },
        data: updateData,
      })

      return res.status(200).json({ mesaj: 'Profil actualizat cu succes' })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ mesaj: 'Eroare la actualizare' })
    }
  }
}
