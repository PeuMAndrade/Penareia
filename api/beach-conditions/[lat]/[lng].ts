import type { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { lat, lng } = req.query as { lat?: string; lng?: string };
  const apiKey = process.env.STORMGLASS_API_KEY;

  if (!lat || !lng) return res.status(400).json({ error: 'Missing lat or lng' });

  if (!apiKey) {
    console.warn('STORMGLASS_API_KEY não configurada. Usando dados simulados.');
    return res.json({
      waterTemperature: { value: 24.5 },
      waveHeight: { value: 0.8 },
      swellHeight: { value: 1.1 },
      swellDirection: { value: 220, text: 'SSE' },
      windSpeed: { value: 12 },
      windDirection: { value: 45, text: 'NE' },
      currentSpeed: { value: 0.4 },
      visibility: { value: 12 },
      uvIndex: { value: 7 },
      tide: { type: 'high', next: '16:30' },
      quality: 'Própria',
      timestamp: new Date().toISOString()
    });
  }

  try {
    // Exemplo de integração real com Stormglass (mantido comentado por segurança)
    /*
    const response = await axios.get(`https://api.stormglass.io/v2/weather/point`, {
      params: { lat, lng, params: 'waterTemperature,waveHeight,windSpeed' },
      headers: { 'Authorization': apiKey }
    });
    return res.json(response.data);
    */

    return res.json({ message: 'Integração real configurada, mas usando mock por segurança de limite.' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar dados da API externa' });
  }
}
