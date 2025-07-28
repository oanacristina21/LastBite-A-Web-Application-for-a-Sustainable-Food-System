// GET toate județele
// POST - adăugare
// PUT - modificare
// DELETE - ștergere (doar dacă nu are localități)

import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const judete = await prisma.jUDET.findMany({ orderBy: { Denumire: 'asc' } })
    return res.status(200).json(judete)
  }

  if (req.method === 'POST') {
    const { denumire } = req.body
    if (!denumire) return res.status(400).json({ mesaj: 'Denumire necesară' })

    const judet = await prisma.jUDET.create({ data: { Denumire: denumire } })
    return res.status(201).json(judet)
  }

  if (req.method === 'PUT') {
    const { id, denumire } = req.body
    if (!id || !denumire) return res.status(400).json({ mesaj: 'Date invalide' })

    const judet = await prisma.jUDET.update({
      where: { IdJudet: id },
      data: { Denumire: denumire }
    })
    return res.status(200).json(judet)
  }

  if (req.method === 'DELETE') {
    const { id } = req.query
    if (!id || Array.isArray(id)) return res.status(400).json({ mesaj: 'ID invalid' })

    const localitati = await prisma.lOCALITATE.findMany({
      where: { IdJudet: parseInt(id) }
    })
    if (localitati.length > 0)
      return res.status(400).json({ mesaj: 'Județul are localități asociate' })

    await prisma.jUDET.delete({ where: { IdJudet: parseInt(id) } })
    return res.status(200).json({ mesaj: 'Șters cu succes' })
  }

  res.status(405).end()
}
