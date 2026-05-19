import type { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';

dotenv.config();

const beaches = [
  { id: 'praia-001', name: 'Praia do Porto da Barra', lat: -13.003, lng: -38.533, city: 'Salvador', region: 'Salvador', type: 'urbana' },
  { id: 'praia-002', name: 'Praia do Forte', lat: -12.576, lng: -37.999, city: 'Mata de São João', region: 'Litoral Norte', type: 'urbana' },
  { id: 'praia-003', name: '2a Praia', lat: -13.382, lng: -38.911, city: 'Morro de São Paulo', region: 'Baixo Sul', type: 'turística' },
  { id: 'praia-004', name: 'Segunda Praia', lat: -13.385, lng: -38.915, city: 'Morro de São Paulo', region: 'Baixo Sul', type: 'turística' },
  { id: 'praia-005', name: 'Praia de Jeribucaçu', lat: -14.309, lng: -38.989, city: 'Itacaré', region: 'Litoral Sul', type: 'preservada' },
  { id: 'praia-006', name: 'Praia dos Nativos', lat: -16.586, lng: -39.091, city: 'Trancoso', region: 'Extremo Sul', type: 'turística' },
  { id: 'praia-007', name: 'Acesso Praia e Rio Caraíva', lat: -16.812, lng: -39.146, city: 'Caraíva', region: 'Extremo Sul', type: 'preservada' },
  { id: 'praia-008', name: 'Praia de Jaguaribe', lat: -12.9606, lng: -38.3947, city: 'Salvador', region: 'Salvador', type: 'urbana' },
  { id: 'praia-009', name: 'Praia do Flamengo', lat: -12.9289, lng: -38.3179, city: 'Salvador', region: 'Salvador', type: 'urbana' },
  { id: 'praia-010', name: 'Praia do Jardim de Alah', lat: -12.9978, lng: -38.443, city: 'Salvador', region: 'Salvador', type: 'urbana' },
  { id: 'praia-011', name: 'Praia de Guarajuba', lat: -12.647, lng: -38.059, city: 'Camaçari', region: 'Litoral Norte', type: 'urbana' },
  { id: 'praia-012', name: 'Praia de Jacuípe', lat: -12.739, lng: -38.155, city: 'Camaçari', region: 'Litoral Norte', type: 'urbana' },
  { id: 'praia-013', name: 'Praia da Paciência', lat: -13.0115, lng: -38.4905, city: 'Salvador', region: 'Salvador', type: 'urbana' },
  { id: 'praia-014', name: 'Praia de Piatã', lat: -12.95, lng: -38.353, city: 'Salvador', region: 'Salvador', type: 'urbana' }
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  res.status(200).json(beaches);
}
