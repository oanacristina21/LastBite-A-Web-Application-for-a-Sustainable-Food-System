/**
 * @swagger
 * /api/produse:
 *   post:
 *     summary: Adaugă un nou produs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               denumire:
 *                 type: string
 *               pretInitial:
 *                 type: number
 *               stoc:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Produs adăugat cu succes
 */


import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/authMiddleware';
import { IncomingForm } from 'formidable';
import { zonedTimeToUtc } from 'date-fns-tz';import fs from 'fs';
import path from 'path';
type OfertaUpdateData = {
  Reducere: number;
  DataInceput?: Date;
  DataSfarsit?: Date;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ mesaj: 'Token lipsă' });

  const user = verifyToken(token);
  if (!user) return res.status(401).json({ mesaj: 'Token invalid sau expirat' });

  const restaurant = await prisma.rESTAURANT.findUnique({
  where: { IdUtilizator: user.id },
  select: { IdRestaurant: true },
});
const parseInputToUtcRequired = (localDateTimeString: string | undefined | null, timeZone: string = 'Europe/Bucharest'): Date => {
  if (!localDateTimeString) {
    throw new Error('Required date string is missing');
  }
  try {
    // Transformă data în UTC pe baza fusului orar
    const date = zonedTimeToUtc(localDateTimeString, timeZone);

    // Verifică dacă obiectul obținut este un Date valid
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date;
    }
    throw new Error('Parsed date is invalid');
  } catch (error) {
    console.error(`Error parsing required date string "${localDateTimeString}" for time zone "${timeZone}":`, error);
    throw new Error('Invalid date format for required field');
  }
};



  if (!restaurant) {
    return res.status(404).json({ mesaj: 'Restaurantul asociat nu a fost găsit.' });
  }

  // 🔹 GET Produse
  if (req.method === 'GET') {
    try {
      const produse = await prisma.pRODUS.findMany({
        where: { IdRestaurant: restaurant.IdRestaurant },
        include: {
          STOC: true,
          OFERTA: true,
          PRODUS_PREFERINTA: true,
        },
      });
      return res.status(200).json(produse);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ mesaj: 'Eroare la obținerea produselor' });
    }
  }

  // 🔹 POST - Adaugă produs
  if (req.method === 'POST') {
    const form = new IncomingForm({ multiples: false });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Eroare la parsare:', err);
        return res.status(500).json({ mesaj: 'Eroare la parsarea formularului.' });
      }

      try {
        // Folder pentru imagini
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const imagineFile = Array.isArray(files.poza) ? files.poza[0] : files.poza;
        let imaginePath = null;

        if (imagineFile && imagineFile.filepath) {
          const newName = `${Date.now()}_${imagineFile.originalFilename}`;
          const newPath = path.join(uploadDir, newName);
          await fs.promises.rename(imagineFile.filepath, newPath);
          imaginePath = `/uploads/${newName}`;
        }

        const produs = await prisma.pRODUS.create({
          data: {
            Denumire: String(fields.Denumire),
            Descriere: fields.Descriere ? String(fields.Descriere) : '',
            Pret_Initial: parseFloat(String(fields.Pret_Initial)),
            DataInregistrare: new Date(),
DataProducere: parseInputToUtcRequired(String(fields.DataProducere)) || undefined,
DataExpirare: parseInputToUtcRequired(String(fields.DataExpirare)),


            IdCategorie: parseInt(String(fields.IdCategorie)),
            IdRestaurant: restaurant.IdRestaurant,
            Imagine: imaginePath,
            STOC: {
              create: {
                Cant_Disp: parseInt(String(fields.Cant_Disp)),

              },
            },
            PRODUS_PREFERINTA: {
              create: JSON.parse(String(fields.Preferinte)).map((id: number) => ({
                IdPreferintaDietetica: id,
              })),
            },
          },
          include: {
            STOC: true,
            PRODUS_PREFERINTA: true,
          },
        });

        return res.status(201).json({ mesaj: 'Produs adăugat', produs });
      } catch (error) {
        console.error('Eroare la salvare produs:', error);
        return res.status(500).json({ mesaj: 'Eroare la salvare produs.' });
      }
    });

    return;
  }


  // 🔹 PATCH - Actualizează produs + ofertă
if (req.method === 'PATCH') {
  try {
    let body = '';
    await new Promise<void>((resolve) => {
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', resolve);
    });

    const parsed = JSON.parse(body);
    const {
      IdProdus,
      Denumire,
      Descriere,
      Pret_Initial,
      DataProducere,
      DataExpirare,
      Cant_Disp,
      Reducere,
      DataInceput,
      DataSfarsit
    } = parsed;
    if (Reducere && Pret_Initial && Reducere > Pret_Initial) {
  return res.status(400).json({ mesaj: 'Reducerea nu poate fi mai mare decât prețul inițial al produsului.' });
}


    if (!IdProdus) {
      return res.status(400).json({ mesaj: 'IdProdus lipsă' });
    }

await prisma.pRODUS.update({
  where: { IdProdus },
  data: {
    Denumire,
    Descriere,
    Pret_Initial,
    DataProducere: parseInputToUtcRequired(DataProducere),
DataExpirare: parseInputToUtcRequired(DataExpirare),
  },
});


    const stocuri = await prisma.sTOC.findMany({
  where: { IdProdus },
  orderBy: { DataValab: 'asc' },
  take: 1,
});

if (stocuri.length > 0) {
  await prisma.sTOC.update({
  where: { IdStoc: stocuri[0].IdStoc },
  data: {
    Cant_Disp: Cant_Disp ?? 0,
    DataValab: new Date(),
  },
});

}

    // ✅ Actualizează sau creează ofertă
    const ofertaExistenta = await prisma.oFERTA.findFirst({ where: { IdProdus } });

    if (ofertaExistenta) {
  const dataUpdate: OfertaUpdateData = {
    Reducere: Reducere ?? 0,
  };

  if (DataInceput) dataUpdate.DataInceput = parseInputToUtcRequired(DataInceput);
  if (DataSfarsit) dataUpdate.DataSfarsit = parseInputToUtcRequired(DataSfarsit);

  await prisma.oFERTA.updateMany({
    where: { IdProdus },
    data: dataUpdate,
  });
} else {
  await prisma.oFERTA.create({
    data: {
      Reducere: Reducere ?? 0,
      DataInceput: parseInputToUtcRequired(DataInceput),
DataSfarsit: parseInputToUtcRequired(DataSfarsit),
      IdProdus,
      IdRestaurant: restaurant.IdRestaurant,
    },
  });
}


    // ✅ Trimite produsul actualizat
    const updated = await prisma.pRODUS.findUnique({
      where: { IdProdus },
      include: {
        OFERTA: true,
        STOC: true,
      },
    });

    return res.status(200).json(updated);
  } catch (err) {
    console.error('Eroare PATCH /api/produse:', err);
    return res.status(500).json({ mesaj: 'Eroare la actualizare produs.' });
  }
}

if (req.method === 'PUT') {
  try {
    const body = await new Promise<string>((resolve) => {
      let raw = '';
      req.on('data', (chunk) => (raw += chunk));
      req.on('end', () => resolve(raw));
    });

    const { IdProdus, Reducere, DataInceput, DataSfarsit, Cant_Disp } = JSON.parse(body);
    const produs = await prisma.pRODUS.findUnique({
  where: { IdProdus },
  select: { Pret_Initial: true },
});

if (!produs) {
  return res.status(404).json({ mesaj: 'Produsul nu a fost găsit.' });
}

if (Number(Reducere) > Number(produs.Pret_Initial)) {
  return res.status(400).json({ mesaj: 'Reducerea nu poate fi mai mare decât prețul produsului.' });
}


    if (!IdProdus || !Reducere || !DataSfarsit || !Cant_Disp) {
      return res.status(400).json({ mesaj: 'Date incomplete' });
    }

    await prisma.sTOC.create({
      data: {
        IdProdus,
        Cant_Disp,
      },
    });

    await prisma.oFERTA.create({
      data: {
        IdProdus,
        IdRestaurant: restaurant.IdRestaurant,
        Reducere,
        DataInceput: new Date(DataInceput),
        DataSfarsit: new Date(DataSfarsit),
      },
    });

    return res.status(200).json({ mesaj: 'Produs reactivat cu succes.' });
  } catch (error) {
    console.error('Eroare la reactivare:', error);
    return res.status(500).json({ mesaj: 'Eroare la reactivare produs.' });
  }
}



if (req.method === 'DELETE') {
  const id = parseInt(req.query.id as string);
  if (isNaN(id)) return res.status(400).json({ mesaj: 'Id produs invalid' });

  try {
    await prisma.oFERTA.deleteMany({ where: { IdProdus: id } });
    await prisma.sTOC.deleteMany({ where: { IdProdus: id } });

    return res.status(200).json({ mesaj: 'Ofertă și stoc șterse. Produsul a rămas în DB.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mesaj: 'Eroare la ștergere ofertă/stoc.' });
  }
}



  // Fallback
  return res.status(405).json({ mesaj: 'Metodă nepermisă' });
}
