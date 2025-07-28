import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const recenzii = await prisma.rECENZIE.findMany({
      include: {
        COMANDA: {
          include: {
            CLIENT: {
              select: {
                Nume: true,
                Prenume: true
              }
            },
            RESTAURANT: {
              select: {
                Denumire: true
              }
            }
          }
        }
      },
      orderBy: {
        DataRecenzie: "desc"
      }
    });

    return res.status(200).json(recenzii);
  }

  if (req.method === "PUT") {
    const { id, raspuns } = req.body;
    if (!id || typeof raspuns !== "string") return res.status(400).json({ mesaj: "Date lipsă" });

    await prisma.rECENZIE.update({
      where: { IdRecenzie: id },
      data: { RaspunsRestaurant: raspuns }
    });

    return res.status(200).json({ mesaj: "Răspuns salvat" });
  }
  if (req.method === "DELETE") {
  const id = Number(req.query.id);
  if (!id) return res.status(400).json({ mesaj: "ID invalid" });

  try {
    await prisma.rECENZIE.delete({
      where: { IdRecenzie: id },
    });
    return res.status(200).json({ mesaj: "Recenzie ștearsă" });
  } catch {
    return res.status(400).json({ mesaj: "Eroare la ștergere" });
  }
}


  res.status(405).end();
}
