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
      const client = await prisma.cLIENT.findUnique({
        where: { IdUtilizator: user.id },
        include: {
          UTILIZATOR: { select: { Nr_Telefon: true, Email: true } },
        },
      })

      if (!client) return res.status(404).json({ mesaj: 'Client inexistent' })

      return res.status(200).json({
        nume: client.Nume,
        prenume: client.Prenume,
        nrTelefon: client.UTILIZATOR.Nr_Telefon,
        email: client.UTILIZATOR.Email,
      })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ mesaj: 'Eroare la preluarea profilului' })
    }
  }

  if (req.method === 'PATCH') {
  const { nume, prenume, nrTelefon, email, parolaNoua } = req.body

  if (!nume || !prenume || !nrTelefon || !email)
    return res.status(400).json({ mesaj: 'Toate câmpurile sunt obligatorii' })

  try {
    await prisma.cLIENT.update({
      where: { IdUtilizator: user.id },
      data: { Nume: nume, Prenume: prenume },
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