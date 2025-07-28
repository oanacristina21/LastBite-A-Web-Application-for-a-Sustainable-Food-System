import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY! as string, {
});

type ProdusStripe = {
  denumire: string;
  pret: number;
  cantitate: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { produse } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: (produse as ProdusStripe[]).map((produs) => ({
        price_data: {
          currency: 'ron',
          product_data: { name: produs.denumire },
          unit_amount: Math.round(produs.pret * 100),
        },
        quantity: produs.cantitate,
      })),
      success_url: `${req.headers.origin}/plata-succes`,
      cancel_url: `${req.headers.origin}/plata-esuata`,
      metadata: {
        produse: JSON.stringify(produse),
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    const mesaj = err instanceof Error ? err.message : 'Eroare necunoscută';
    res.status(500).json({ mesaj });
  }
}
