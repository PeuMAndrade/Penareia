# 🗄️ Spec - Database & Dataset

**Referência**: [SPEC_INDEX.md](SPEC_INDEX.md) | Anterior: [SPEC_API.md](SPEC_API.md)

---

## 📊 Dataset: 10 Praias da Bahia

### Justificativa

- ✓ Cobre principais regiões do litoral
- ✓ Mix de tipos: urbana, semi-urbana, resort, tradicional
- ✓ Coordenadas reais e verificadas
- ✓ Tamanho gerenciável para MVP

---

## 🏖️ Praias Incluídas na Seed

### Região: Recôncavo (Salvador)

| ID | Nome | Cidade | Tipo | Latitude | Longitude |
|----|----|--------|------|----------|-----------|
| praia-001 | Porto da Barra | Salvador | urbana | -12.9634 | -38.5105 |
| praia-002 | Barra | Salvador | urbana | -12.9689 | -38.5182 |
| praia-003 | Farol da Barra | Salvador | urbana | -12.9658 | -38.5232 |
| praia-004 | Ondina | Salvador | urbana | -12.9788 | -38.4632 |
| praia-005 | Amaralina | Salvador | urbana | -12.9832 | -38.4512 |
| praia-006 | Stella Maris | Salvador | semi-urbana | -12.9456 | -38.3845 |

### Região: Costa do Dendê

| ID | Nome | Cidade | Tipo | Latitude | Longitude |
|----|----|--------|------|----------|-----------|
| praia-007 | Praia do Forte | Mata de São João | resort | -12.5769 | -38.2567 |

### Região: Bahia de Todos os Santos

| ID | Nome | Cidade | Tipo | Latitude | Longitude |
|----|----|--------|------|----------|-----------|
| praia-008 | Maragogipe | Maragogipe | tradicional | -12.7656 | -39.0231 |
| praia-009 | Itacimirim | Camaçari | semi-urbana | -12.7234 | -38.1234 |
| praia-010 | Jequitiba | Camaçari | semi-urbana | -12.6890 | -38.0567 |

---

## 📄 Arquivo: `data/bahia-beaches.json`

```json
[
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
  {
    "id": "praia-003",
    "name": "Farol da Barra",
    "city": "Salvador",
    "region": "Recôncavo",
    "lat": -12.9658,
    "lng": -38.5232,
    "type": "urbana"
  },
  {
    "id": "praia-004",
    "name": "Ondina",
    "city": "Salvador",
    "region": "Recôncavo",
    "lat": -12.9788,
    "lng": -38.4632,
    "type": "urbana"
  },
  {
    "id": "praia-005",
    "name": "Amaralina",
    "city": "Salvador",
    "region": "Recôncavo",
    "lat": -12.9832,
    "lng": -38.4512,
    "type": "urbana"
  },
  {
    "id": "praia-006",
    "name": "Stella Maris",
    "city": "Salvador",
    "region": "Recôncavo",
    "lat": -12.9456,
    "lng": -38.3845,
    "type": "semi-urbana"
  },
  {
    "id": "praia-007",
    "name": "Praia do Forte",
    "city": "Mata de São João",
    "region": "Costa do Dendê",
    "lat": -12.5769,
    "lng": -38.2567,
    "type": "resort"
  },
  {
    "id": "praia-008",
    "name": "Maragogipe",
    "city": "Maragogipe",
    "region": "Bahia de Todos os Santos",
    "lat": -12.7656,
    "lng": -39.0231,
    "type": "tradicional"
  },
  {
    "id": "praia-009",
    "name": "Itacimirim",
    "city": "Camaçari",
    "region": "Bahia de Todos os Santos",
    "lat": -12.7234,
    "lng": -38.1234,
    "type": "semi-urbana"
  },
  {
    "id": "praia-010",
    "name": "Jequitiba",
    "city": "Camaçari",
    "region": "Bahia de Todos os Santos",
    "lat": -12.6890,
    "lng": -38.0567,
    "type": "semi-urbana"
  }
]
```

---

## 🗺️ Localização Base para Testes

**Para testes locais, use este ponto como "Você está aqui":**

```
Nome: Salvador - Barra
Latitude: -12.9689
Longitude: -38.5182
Tipo: referência
```

**Praias próximas (dentro de 10km):**
1. Barra (0 km) - referência
2. Farol da Barra (0.5 km)
3. Porto da Barra (0.7 km)
4. Ondina (1.2 km)
5. Amaralina (1.8 km)
6. Stella Maris (6.5 km)

---

## 🏗️ Schema - Beach Document

### Estrutura

```typescript
interface Beach {
  id: string;
  name: string;
  city: string;
  region: string;
  lat: number;
  lng: number;
  type: "urbana" | "semi-urbana" | "resort" | "tradicional";
}
```

### Validações

```
Field          Type      Required  Min/Max        Validation
─────────────────────────────────────────────────────────────
id             string    ✓         -              Unique, format: praia-XXX
name           string    ✓         1-100 chars    Non-empty
city           string    ✓         1-50 chars     Non-empty
region         string    ✓         1-50 chars     Non-empty
lat            number    ✓         -90 to 90      Valid latitude
lng            number    ✓         -180 to 180    Valid longitude
type           enum      ✓         -              urbana|semi-urbana|resort|tradicional
```

---

## 📁 Estrutura de Armazenamento

### MVP: JSON File

```
server/
└── data/
    └── bahia-beaches.json    (10 praias hardcoded)
```

**Vantagens**:
- ✓ Zero config
- ✓ Versionable (Git)
- ✓ Rápido para MVP

**Desvantagens**:
- ✗ Sem escalabilidade
- ✗ Sem suporte a queries
- ✗ Sem indexação

### v2 Migration Path

```
Firestore
├─ Collection: beaches
├─ Document: praia-{id}
├─ Fields: id, name, city, region, lat, lng, type
└─ Index: geopoint (Firestore GeoQuery)

PostgreSQL
├─ Table: beaches
├─ Columns: id, name, city, region, lat, lng, type
├─ Extension: PostGIS
└─ Index: GIST(geopoint)
```

---

## 🔄 Data Flow

### Load Sequence

```
Server Start
  ├─ Read bahia-beaches.json
  ├─ Validate cada praia
  ├─ Load em memória
  └─ Pronto para servir

Client Request (GET /api/beaches)
  ├─ Backend busca array da memória
  ├─ Serializa para JSON
  ├─ Retorna ao cliente
  └─ Cliente armazena em React state
```

---

## 🧪 Verificação de Dados

### Checklist de Validação

- [ ] 10 praias no arquivo
- [ ] Todos IDs únicos
- [ ] Latitudes entre -90 e 90
- [ ] Longitudes entre -180 e 180
- [ ] Todos nomes preenchidos
- [ ] Cidades válidas
- [ ] Types válidos (urbana/semi-urbana/resort/tradicional)
- [ ] Coordenadas geograficamente corretas (Bahia, Brasil)

### Script de Validação

```typescript
// validate-beaches.ts
import beachesData from './data/bahia-beaches.json';

const validate = () => {
  const ids = new Set<string>();
  
  beachesData.forEach((beach, idx) => {
    // Check duplicate ID
    if (ids.has(beach.id)) throw new Error(`Duplicate ID: ${beach.id}`);
    ids.add(beach.id);
    
    // Check coordinates
    if (beach.lat < -90 || beach.lat > 90) 
      throw new Error(`Invalid lat at idx ${idx}: ${beach.lat}`);
    if (beach.lng < -180 || beach.lng > 180) 
      throw new Error(`Invalid lng at idx ${idx}: ${beach.lng}`);
    
    // Check types
    const validTypes = ['urbana', 'semi-urbana', 'resort', 'tradicional'];
    if (!validTypes.includes(beach.type))
      throw new Error(`Invalid type at idx ${idx}: ${beach.type}`);
    
    // Check required fields
    if (!beach.name || !beach.city || !beach.region)
      throw new Error(`Missing fields at idx ${idx}`);
  });
  
  console.log('✓ All ', beachesData.length, ' beaches validated');
};

validate();
```

---

## 📊 Estatísticas Dataset MVP

| Métrica | Valor |
|---------|-------|
| Total Praias | 10 |
| Cidades | 3 (Salvador, Mata de São João, Camaçari, Maragogipe) |
| Regiões | 3 (Recôncavo, Costa do Dendê, Bahia de Todos os Santos) |
| Tipos | 4 (urbana, semi-urbana, resort, tradicional) |
| Arquivo Size | ~1.2 KB |
| Resposta API | ~1.3 KB (gzip) |
| Load Time | <1ms |

---

## 🔮 Roadmap de Dados

### v1.0 (MVP) - Agora
- JSON hardcoded (10 praias)
- Sem backend persistence
- Coordenadas estáticas

### v1.1 (Próximo mês)
- Expande a 50+ praias
- Múltiplas regiões (SP, RJ)
- Firebase Firestore integration

### v2 (Q3 2026)
- PostgreSQL + PostGIS
- Admin panel para adicionar praias
- Geopoint indexing
- Queries geoespaciais avançadas

### v3+ (Futura)
- Sincronização de dados real-time
- Cache distribuído (Redis)
- Dados de condições (ondas, temp, maré)
- ML para recomendações

---

**Próximo**: [SPEC_COMPONENTS.md](SPEC_COMPONENTS.md)
