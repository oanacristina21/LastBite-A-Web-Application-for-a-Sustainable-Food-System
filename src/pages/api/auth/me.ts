import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/authMiddleware';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ mesaj: 'Neautentificat' });

    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ mesaj: 'Token invalid sau expirat' });

    const userId = decoded.id;

    const utilizator = await prisma.uTILIZATOR.findUnique({
      where: { IdUtilizator: userId },
      include: {
        CLIENT: true,
        RESTAURANT: true,
        ADMIN: true,
      },
    });

    if (!utilizator) return res.status(404).json({ mesaj: 'Utilizator inexistent' });

    let tip: 'client' | 'restaurant' | 'admin' = 'client';

    if (utilizator.ADMIN) tip = 'admin';
    else if (utilizator.RESTAURANT) tip = 'restaurant';

    return res.status(200).json({
      id: utilizator.IdUtilizator,
      email: utilizator.Email,
      tip,
      nume: utilizator.CLIENT ? `${utilizator.CLIENT.Prenume} ${utilizator.CLIENT.Nume}` : null,
      denumireRestaurant: utilizator.RESTAURANT?.Denumire || null,
    });

  } catch (err) {
    console.error('Eroare verificare token:', err);
    return res.status(500).json({ mesaj: 'Eroare internă server' });
  }
}
