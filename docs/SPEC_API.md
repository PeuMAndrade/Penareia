# 📡 Spec - API Endpoints

**Referência**: [SPEC_INDEX.md](SPEC_INDEX.md) | Anterior: [SPEC_ARCHITECTURE.md](SPEC_ARCHITECTURE.md)

---

## 🔌 API Base

**Base URL**: `http://localhost:3000`

**Environment Variable**:
```env
VITE_API_BASE_URL=http://localhost:3000
```

---

## 📋 Endpoints

### 1. GET `/api/beaches`

**Descrição**: Retorna todas as praias de Bahia

**Método**: `GET`

**Autenticação**: Nenhuma (público)

**Query Parameters**: Nenhum

**Request**:
```bash
curl http://localhost:3000/api/beaches
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "praia-001",
      "name": "Porto da Barra",
      "city": "Salvador",
      "region": "Recôncavo",
      "lat": -12.9634,
      "lng": -38.5105,
      "type": "urbana"
    },
    {
      "id": "praia-002",
      "name": "Barra",
      "city": "Salvador",
      "region": "Recôncavo",
      "lat": -12.9689,
      "lng": -38.5182,
      "type": "urbana"
    },
    ...
  ],
  "count": 10,
  "timestamp": "2026-05-14T10:30:00Z"
}
```

**Response** (500 Error):
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Failed to load beaches"
}
```

**Headers**:
```
Content-Type: application/json
Access-Control-Allow-Origin: *
```

**Timeout**: 5s

**Cache**: 1 min (HTTP 304 se não mudou)

---

## 🏖️ Data Types

### Beach Interface

```typescript
interface Beach {
  id: string;              // Unique identifier: "praia-{number}"
  name: string;            // Friendly name: "Porto da Barra"
  city: string;            // City: "Salvador"
  region: string;          // Region: "Recôncavo"
  lat: number;             // Latitude: -12.9634
  lng: number;             // Longitude: -38.5105
  type: "urbana" | "semi-urbana" | "resort" | "tradicional"; // Beach type
}
```

### Location Interface (Frontend)

```typescript
interface Location {
  lat: number;             // User latitude
  lng: number;             // User longitude
  accuracy: number;        // Accuracy in meters (from Geolocation API)
  timestamp?: number;      // Unix timestamp
}
```

### API Response Wrapper

```typescript
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
  timestamp?: string;
}
```

---

## 📊 Formato de Dados

### Distance Calculation Response (Frontend)

```typescript
interface NearbyBeach extends Beach {
  distance: number;        // Distance in km (calculated)
  distanceFormatted: string; // "2.5 km"
}
```

### Request/Response Sizes

| Endpoint | Request | Response |
|----------|---------|----------|
| GET /api/beaches | ~0 bytes | ~3KB |

---

## 🔄 Polling Strategy

### Intervalo: 30s

```typescript
// Frontend code (exemplo)
useEffect(() => {
  const interval = setInterval(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/beaches`);
      setBeaches(response.data.data);
    } catch (error) {
      console.error('Failed to fetch beaches:', error);
    }
  }, 30000); // 30 segundos
  
  return () => clearInterval(interval);
}, []);
```

### Rate Limiting

**MVP**: Sem rate limiting (simples)
- Produção: Max 10 requests/min por IP

---

## ✅ Response Validation

```typescript
// Validar resposta
const isValid = (data: Beach): boolean => {
  return !!(
    data.id &&
    data.name &&
    data.city &&
    data.region &&
    typeof data.lat === 'number' &&
    typeof data.lng === 'number' &&
    data.lat >= -90 && data.lat <= 90 &&
    data.lng >= -180 && data.lng <= 180 &&
    data.type
  );
};
```

---

## 🚨 Error Handling

### Possíveis Erros

| Status | Causa | Ação |
|--------|-------|------|
| 200 | Sucesso | Continue |
| 500 | Erro servidor | Retry em 30s |
| 503 | Serviço unavailable | Retry com backoff |
| Network Timeout | Sem conexão | Offline mode |

### Retry Strategy

```typescript
// Exponential backoff
const maxRetries = 3;
const baseDelay = 1000; // 1s

const retry = async (attempt = 0) => {
  try {
    return await fetchBeaches();
  } catch (error) {
    if (attempt < maxRetries) {
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(r => setTimeout(r, delay));
      return retry(attempt + 1);
    }
    throw error;
  }
};
```

---

## 📦 Backend Implementation (Express)

### File: `server.ts` (ou `server/routes/beaches.ts`)

```typescript
import express from 'express';
import beachesData from './data/bahia-beaches.json';

const app = express();

// CORS Headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// GET /api/beaches
app.get('/api/beaches', (req, res) => {
  try {
    res.json({
      success: true,
      data: beachesData,
      count: beachesData.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to load beaches'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(3000, () => {
  console.log('✓ Server running on http://localhost:3000');
});
```

---

## 🧪 Testes Manual

### cURL

```bash
# Test endpoint
curl -i http://localhost:3000/api/beaches

# Test com jq (formatar JSON)
curl -s http://localhost:3000/api/beaches | jq '.'

# Test timing
time curl -s http://localhost:3000/api/beaches > /dev/null
```

### JavaScript/Fetch

```javascript
// Teste no console do navegador
fetch('http://localhost:3000/api/beaches')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e));
```

### Postman Collection

```json
{
  "info": {
    "name": "Pé na Areia - Beaches API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0"
  },
  "item": [
    {
      "name": "Get All Beaches",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/beaches"
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3000"
    }
  ]
}
```

---

## 📈 Performance

### Response Time Target

| Métrica | Target | Máx |
|--------|--------|-----|
| TTFB | <100ms | 500ms |
| Total | <200ms | 1000ms |

### Benchmarks

```
GET /api/beaches
├─ File I/O: ~10ms
├─ JSON serialize: ~2ms
├─ HTTP overhead: ~50ms
└─ Total: ~62ms ✓ Dentro do target
```

---

## 🔐 Security (MVP)

**MVP Não tem autenticação**.

Considere em produção:
- [ ] API Key
- [ ] JWT tokens
- [ ] Rate limiting (IP)
- [ ] CORS restrictivo
- [ ] Input validation

---

## 📱 Mobile Considerations

### Headers Mobile-Friendly

```
Accept: application/json
User-Agent: (mobile, tablet, desktop)
```

### Payload Optimization

- ✓ Resposta ~3KB (gzip ~1KB)
- ✓ Sem imagens
- ✓ Sem recursos pesados

---

**Próximo**: [SPEC_DATABASE.md](SPEC_DATABASE.md)
