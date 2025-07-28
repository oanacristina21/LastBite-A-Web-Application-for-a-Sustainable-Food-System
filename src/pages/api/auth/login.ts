import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/authMiddleware'; 
import * as cookie from 'cookie';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, parola } = req.body;

  const user = await prisma.uTILIZATOR.findUnique({
    where: { Email: email },
    include: {
      CLIENT: true,
      RESTAURANT: true,
    },
  });
  


  if (!user) return res.status(401).json({ mesaj: 'Email invalid' });

  const parolaCorecta = await bcrypt.compare(parola, user.Parola);
  if (!parolaCorecta) return res.status(401).json({ mesaj: 'Parolă greșită' });


  

let tip: 'client' | 'restaurant' | 'admin' | null = null;
let clientId: number | undefined;
let restaurantId: number | undefined;

const admin = await prisma.aDMIN.findUnique({
  where: { IdUtilizator: user.IdUtilizator },
});

if (admin) {
  tip = 'admin';
}
 else if (user.CLIENT) {
  tip = 'client';
  clientId = user.CLIENT.IdUtilizator;
} else if (user.RESTAURANT) {
  tip = 'restaurant';
  restaurantId = user.RESTAURANT.IdRestaurant;
}

if (!tip) return res.status(403).json({ mesaj: 'Tip utilizator necunoscut. Contactează admin.' });


const tokenPayload: {
  id: number;
  email: string;
  tip: 'admin' | 'client' | 'restaurant';
  clientId?: number;
  restaurantId?: number;
} = {
  id: user.IdUtilizator,
  email: user.Email, 
  tip,
};


if (clientId) {
  tokenPayload.clientId = clientId;
}

if (restaurantId) {
  tokenPayload.restaurantId = restaurantId;
}

const token = signToken(tokenPayload);


  res.setHeader('Set-Cookie', cookie.serialize('token', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  }));

  return res.status(200).json({ mesaj: 'Autentificare reușită', id: user.IdUtilizator, tip });
}
