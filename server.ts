import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
console.log('process.env.VITE_GOOGLE_MAPS_API_KEY=', process.env.VITE_GOOGLE_MAPS_API_KEY);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
  });

  // API Proxy para Dados Marítimos (Simulado ou Real)
  app.get('/api/beach-conditions/:lat/:lng', async (req, res) => {
    const { lat, lng } = req.params;
    const apiKey = process.env.STORMGLASS_API_KEY;

    // Se não houver chave, retornamos dados simulados realistas para o MVP
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
      // Exemplo de integração real com Stormglass (Comentado para evitar erro sem chave)
      /*
      const response = await axios.get(`https://api.stormglass.io/v2/weather/point`, {
        params: { lat, lng, params: 'waterTemperature,waveHeight,windSpeed' },
        headers: { 'Authorization': apiKey }
      });
      res.json(response.data);
      */
      res.json({ message: "Integração real configurada, mas usando mock por segurança de limite." });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar dados da API externa' });
    }
  });

  // Mock de praias da Bahia focado em pontos de praia relevantes para o mapa
  app.get('/api/beaches', (req, res) => {
    res.json([
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
    ]);
  });

  // Endpoint de recomendação (mock data)
  app.post('/api/recommendation', (req, res) => {
    const { beachName } = req.body;
    const recommendations = [
      "Dia perfeito para relaxar e curtir o som do mar! 🌊",
      "Ótimas ondas! Leve sua prancha e aproveite a costa. 🏄",
      "Maré favorável, água morna. Venha conhecer! ☀️",
      "Pôr do sol incrível nesta praia hoje. Não perca! 🌅"
    ];
    const text = recommendations[Math.floor(Math.random() * recommendations.length)];
    res.json({ text });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Pé na Areia rodando em http://localhost:${PORT}`);
  });
}

startServer();
