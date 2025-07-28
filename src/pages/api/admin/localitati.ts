// pages/api/admin/localitati.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const localitati = await prisma.lOCALITATE.findMany({
  include: {
    JUDET: true, 
  },
});

    return res.status(200).json(localitati);
  }

  if (req.method === "POST") {
    const { denumire, idJudet } = req.body;
    if (!denumire || !idJudet) return res.status(400).json({ mesaj: "Date lipsă" });

    const noua = await prisma.lOCALITATE.create({
      data: {
        Denumire: denumire,
        IdJudet: idJudet,
      },
    });
    return res.status(201).json(noua);
  }

  if (req.method === "PUT") {
    const { id, denumire, idJudet } = req.body;
    if (!id || !denumire || !idJudet) return res.status(400).json({ mesaj: "Date lipsă" });

    await prisma.lOCALITATE.update({
      where: { IdLocalitate: id },
      data: {
        Denumire: denumire,
        IdJudet: idJudet,
      },
    });
    return res.status(200).json({ mesaj: "Modificat" });
  }

  if (req.method === "DELETE") {
    const id = Number(req.query.id);
    if (!id) return res.status(400).json({ mesaj: "ID invalid" });

    try {
      await prisma.lOCALITATE.delete({ where: { IdLocalitate: id } });
      return res.status(200).json({ mesaj: "Șters cu succes" });
    } catch {

      return res.status(400).json({ mesaj: "Nu poți șterge – este utilizată" });
    }
  }

  res.status(405).end();
}
