# Pe na Areia

Aplicacao web para explorar praias no mapa, consultar condicoes maritimas e gerar recomendacoes curtas com IA.

## Visao Geral

O projeto roda com um servidor Express que:
- serve a aplicacao React (via Vite middleware em desenvolvimento);
- expoe endpoints HTTP para praias e condicoes de mar;
- gera recomendacoes usando Gemini (quando configurado).

## Stack

- React 19 + TypeScript
- Vite 6
- Express 4
- Axios
- Google Maps JavaScript API
- Gemini API (`@google/genai`)

## Como Rodar

### 1. Requisitos

- Node.js 18+
- npm

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar ambiente

Use o arquivo de exemplo:

```bash
cp .env.example .env
```

Variaveis esperadas:
- `VITE_GOOGLE_MAPS_API_KEY` (obrigatoria para o mapa)
- `VITE_GOOGLE_MAPS_MAP_ID` (opcional; habilita marcadores avancados no Google Maps)
- `STORMGLASS_API_KEY` (opcional; sem ela, usa dados simulados de condicoes)
- `GEMINI_API_KEY` (opcional; sem ela, recomendacao retorna texto padrao)
- `APP_URL` (opcional no desenvolvimento local)

### 4. Iniciar em desenvolvimento

```bash
npm run dev
```

A aplicacao sobe em `http://localhost:3000`.

## Scripts

- `npm run dev`: inicia servidor TypeScript (`server.ts`) com Vite middleware
- `npm run start`: executa servidor Node
- `npm run build`: gera build frontend com Vite
- `npm run preview`: preview da build
- `npm run clean`: remove `dist`
- `npm run lint`: valida TypeScript sem emitir arquivos

## Endpoints da API

### GET `/api/beaches`
Retorna lista de praias disponiveis no backend.

### GET `/api/beach-conditions/:lat/:lng`
Retorna condicoes maritimas para coordenadas.
- Com `STORMGLASS_API_KEY`: preparado para integracao real
- Sem `STORMGLASS_API_KEY`: retorna mock realista

### POST `/api/recommendation`
Gera recomendacao curta com base na praia e nas condicoes.

Exemplo de body:

```json
{
  "beachName": "Praia do Forte",
  "conditions": {
    "tide": { "type": "high", "next": "16:30" },
    "windSpeed": { "value": 12 },
    "waterTemperature": { "value": 24.5 }
  }
}
```

## Estrutura do Projeto

```text
.
├── server.ts
├── src/
│   ├── App.tsx
│   ├── components/
│   │   └── BeachMap.tsx
│   ├── index.css
│   └── main.tsx
├── docs/
│   ├── SPEC_INDEX.md
│   ├── SPEC_DECISIONS.md
│   ├── SPEC_ARCHITECTURE.md
│   ├── SPEC_API.md
│   ├── SPEC_DATABASE.md
│   ├── SPEC_COMPONENTS.md
│   └── SPEC_IMPLEMENTATION.md
├── .env.example
├── package.json
└── README.md
```

## Specs do MVP (Bahia)

A evolucao do MVP definida no planejamento esta modularizada em:
- `docs/SPEC_INDEX.md`
- `docs/SPEC_DECISIONS.md`
- `docs/SPEC_ARCHITECTURE.md`
- `docs/SPEC_API.md`
- `docs/SPEC_DATABASE.md`
- `docs/SPEC_COMPONENTS.md`
- `docs/SPEC_IMPLEMENTATION.md`

## Observacoes

- O servidor atual usa dados mock para algumas rotas.
- A especificacao de MVP (Bahia, polling 30s, Haversine, 10 praias, raio 10km) esta detalhada nos arquivos em `docs/` e pode ser implementada por etapas conforme o plano.
