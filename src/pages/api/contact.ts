import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { verifyToken } from '@/lib/authMiddleware'; // dacă ai deja


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { subject, message } = req.body;
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ mesaj: 'Neautorizat' });

  const user = verifyToken(token);
  console.log('Utilizator decodat:', user);

  if (!user) return res.status(401).json({ mesaj: 'Token invalid' });

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // ex: lastbite.confirmari@gmail.com
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    await transporter.sendMail({
      from: user.email, // presupunem că tokenul conține emailul
      to: 'lastbite.confirmari@gmail.com',
      subject: `Formular Contact - ${subject}`,
      text: `Mesaj de la ${user.email}:\n\n${message}`,
    });

    res.status(200).json({ mesaj: 'Email trimis cu succes!' });
  } catch (err) {
    console.error('Eroare trimitere email:', err);
    res.status(500).json({ mesaj: 'Eroare la trimiterea emailului' });
  }
}
