import {PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/authMiddleware';
import { serialize } from 'cookie';


const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const {
    email,
    parola,
    nr_telefon,
    IdLocalitate,
    tip,
    nume,
    prenume,
    denumireRest,
    adresaRest
  } = req.body;

  const userExist = await prisma.uTILIZATOR.findFirst({
      where: {
        OR: [
          { Email: email },
          { Nr_Telefon: nr_telefon }
        ]
      }
    });

    if (userExist) {
      let mesaj = 'Utilizator deja existent.';
      if (userExist.Email === email) mesaj = 'Email deja folosit.';
      else if (userExist.Nr_Telefon === nr_telefon) mesaj = 'Număr de telefon deja folosit.';
      return res.status(400).json({ mesaj });
    }
  const hashed = await bcrypt.hash(parola, 10);

  const user = await prisma.uTILIZATOR.create({
    data: {
      Email: email,
      Parola: hashed,
      Nr_Telefon: nr_telefon,
      IdLocalitate: IdLocalitate,
    },
  });

  if (tip === 'client') {
    await prisma.cLIENT.create({
      data: {
        IdUtilizator: user.IdUtilizator,
        Nume: nume,
        Prenume: prenume,
      },
    });
  } else if (tip === 'restaurant') {
  const localitate = await prisma.lOCALITATE.findUnique({
  where: { IdLocalitate },
  include: { JUDET: true },
});

const adresaCompleta = `${adresaRest}, ${localitate?.Denumire}, ${localitate?.JUDET?.Denumire}, Romania`;
const encodedAddress = encodeURIComponent(adresaCompleta);
const apiKey = process.env.GOOGLE_MAPS_API_KEY;

const geocodeRes = await fetch(
  `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`
);

const geocodeData = await geocodeRes.json();
console.log("Adresa completa:", adresaCompleta);
console.log("Raspuns Google:", JSON.stringify(geocodeData, null, 2));


const { lat, lng } = geocodeData.results?.[0]?.geometry?.location || { lat: null, lng: null };


await prisma.rESTAURANT.create({
  data: {
    IdUtilizator: user.IdUtilizator,
    Denumire: denumireRest,
    Adresa: adresaRest,
    IdLocalitate,
    Latitude: lat,
    Longitude: lng,
  },
});

}



const token = signToken({ id: user.IdUtilizator, tip, email });


  res.setHeader(
    'Set-Cookie',
    serialize('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
  );

  res.status(201).json({ mesaj: 'Cont creat', id: user.IdUtilizator });
}
