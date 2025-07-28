import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || 'secret123';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body;

  const user = await prisma.uTILIZATOR.findUnique({
    where: { Email: email },
  });

  if (!user) return res.status(404).json({ mesaj: 'Email invalid' });

  const resetToken = jwt.sign({ id: user.IdUtilizator }, SECRET, { expiresIn: '1h' });

  await prisma.uTILIZATOR.update({
  where: { IdUtilizator: user.IdUtilizator },
  data: {
    passwordResetToken: resetToken as string, 
    passwordResetExpires: new Date(Date.now() + 3600000) as Date,
  },
});


  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `${process.env.APP_URL}/reset-password/${resetToken}`;

  const mailOptions = {
    to: email,
    subject: 'Link pentru resetarea parolei',
    text: `Click pe acest link pentru a reseta parola: ${resetLink}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ mesaj: 'Link-ul de resetare a fost trimis pe email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mesaj: 'Eroare la trimiterea emailului de resetare.' });
  }
}
