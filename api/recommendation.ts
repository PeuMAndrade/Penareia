import type { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';

dotenv.config();

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { beachName } = req.body || {};
  const recommendations = [
    'Dia perfeito para relaxar e curtir o som do mar! 🌊',
    'Ótimas ondas! Leve sua prancha e aproveite a costa. 🏄',
    'Maré favorável, água morna. Venha conhecer! ☀️',
    'Pôr do sol incrível nesta praia hoje. Não perca! 🌅'
  ];

  const text = recommendations[Math.floor(Math.random() * recommendations.length)];
  return res.status(200).json({ text, beachName: beachName ?? null });
}
