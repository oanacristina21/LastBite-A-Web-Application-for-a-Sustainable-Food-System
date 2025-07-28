import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || 'secret123';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { token } = req.body;  // Token-ul de resetare din body
  const { newPassword } = req.body;  // Noua parolă

  try {
    interface DecodedToken {
      id: number;
    }

    // Verificăm token-ul
    const decoded = jwt.verify(token, SECRET) as DecodedToken;

    // Găsește utilizatorul pe baza tokenului
    const user = await prisma.uTILIZATOR.findUnique({
      where: { IdUtilizator: decoded.id },
    });

    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      return res.status(400).json({ mesaj: 'Token invalid sau expirat' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.uTILIZATOR.update({
      where: { IdUtilizator: user.IdUtilizator },
      data: { Parola: hashedPassword, passwordResetToken: null, passwordResetExpires: null },
    });

    res.status(200).json({ mesaj: 'Parola a fost resetată cu succes' });
  } catch (error) {
    console.error(error);  
    res.status(500).json({ mesaj: 'Eroare la resetarea parolei.' });
  }
}
