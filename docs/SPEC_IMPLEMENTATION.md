# 📋 Spec - Implementação & Roadmap

**Referência**: [SPEC_INDEX.md](SPEC_INDEX.md) | Anterior: [SPEC_COMPONENTS.md](SPEC_COMPONENTS.md)

---

## 🚀 Plano de Implementação

### Timeline: 4-5 horas (MVP)

---

## 📅 Sprint 1: Backend (30 min)

**Objetivo**: Setup API endpoint para praias

### Tasks

- [ ] Criar `server/data/bahia-beaches.json` com 10 praias
- [ ] Criar `server/routes/beaches.ts`
  - GET `/api/beaches` ← retorna array
- [ ] Adicionar CORS headers
- [ ] Testar com curl/Postman

### Checklist

```bash
# 1. Arquivo JSON criado ✓
ls server/data/bahia-beaches.json

# 2. Endpoint testável ✓
curl http://localhost:3000/api/beaches | jq

# 3. Resposta válida ✓
- status 200
- success: true
- data: array[]
- count: 10
```

### Estimado: 30 min

---

## 📅 Sprint 2: Utils (20 min)

**Objetivo**: Implementar lógica de cálculo de distância

### Tasks

- [ ] Criar `src/types/index.ts`
  - Beach interface
  - Location interface
  - BeachWithDistance interface
- [ ] Criar `src/utils/distance.ts`
  - calculateDistance() (Haversine)
  - formatDistance()
  - filterNearbyBeaches()
- [ ] Testes unitários básicos

### Checklist

```typescript
// Teste manual
import { calculateDistance } from './src/utils/distance';

const dist = calculateDistance(-12.9689, -38.5182, -12.9658, -38.5232);
console.log(dist); // Deve ser ~0.5km
```

### Estimado: 20 min

---

## 📅 Sprint 3: Hooks (30 min)

**Objetivo**: Hookear Geolocation API e Fetch de praias

### Tasks

- [ ] Criar `src/hooks/useGeolocation.ts`
  - watchPosition() setup
  - Error handling
  - Cleanup
- [ ] Criar `src/hooks/useFetchBeaches.ts`
  - Polling a cada 30s
  - Retry logic
  - Cache

### Checklist

```typescript
// Teste manual no console
import { useGeolocation } from './src/hooks/useGeolocation';

// No componente React
const { location, error, isLoading } = useGeolocation();
console.log('Location:', location); // Deve ter lat, lng
```

### Estimado: 30 min

---

## 📅 Sprint 4: Componentes (1.5h)

**Objetivo**: Criar componentes React

### Tasks

- [ ] Atualizar `src/components/BeachMap.tsx`
  - Suporte a userLocation marker (azul)
  - Círculo de 10km
  - Marcadores dinâmicos (vermelho/gray)
  
- [ ] Criar `src/components/NearbyBeaches.tsx` (novo)
  - Lista de praias
  - Cards com distância
  - Click handlers
  - Scroll

### Checklist

```
Visual:
- [ ] Mapa carrega sem erro
- [ ] User marker aparece (azul)
- [ ] Praias aparecem (vermelho se próximas)
- [ ] Círculo 10km é visível
- [ ] List mostra praias ordenadas
- [ ] Cards são clicáveis
```

### Estimado: 1.5h

---

## 📅 Sprint 5: Integração (1h)

**Objetivo**: Conectar tudo em App.tsx

### Tasks

- [ ] Atualizar `src/App.tsx`
  - useGeolocation()
  - useFetchBeaches()
  - Computar nearbyBeaches
  - Passar props
  
- [ ] Variáveis de ambiente
  - VITE_API_BASE_URL
  - VITE_GOOGLE_MAPS_API_KEY
  
- [ ] Debug & testes

### Integração Steps

```typescript
// 1. Importar hooks
import { useGeolocation } from './hooks/useGeolocation';
import { useFetchBeaches } from './hooks/useFetchBeaches';

// 2. Usar hooks
const { location: userLocation } = useGeolocation();
const { beaches } = useFetchBeaches();

// 3. Computar nearby
const nearbyBeaches = useMemo(() => {
  if (!userLocation) return [];
  return filterNearbyBeaches(...);
}, [userLocation, beaches]);

// 4. Renderizar
<BeachMap beaches={beaches} nearbyBeaches={nearbyBeaches} />
<NearbyBeaches beaches={nearbyBeaches} />
```

### Estimado: 1h

---

## 🧪 Testes Manuais (MVP Validation)

### Cenário 1: Permissões Geolocation

**Pré-requisito**: Navegador moderno (Chrome, Firefox, Safari)

```
1. Abrir app
2. Aparecer prompt de permissão
3. Clicar "Permitir" / "Allow"
4. Aguardar ~2s
5. ✓ Localização deve aparecer no mapa (ícone azul)
6. ✓ Console deve mostrar: { lat, lng, accuracy }
```

### Cenário 2: Busca de Praias

```
1. Abrir app
2. Aguardar carregamento
3. ✓ Mapa deve mostrar marcadores vermelhos
4. ✓ Lista deve mostrar 5-10 praias próximas
5. ✓ Ordem deve ser por distância (nearest first)
6. ✓ Distâncias devem ser razoáveis (~0-10km)
```

### Cenário 3: Cálculo de Distância

**Teste Manual de Distância**:

```
Cenário: User em Salvador-Barra (-12.9689, -38.5182)

Praias próximas esperadas:
1. Barra (0 km) - same location
2. Farol da Barra (~0.5 km)
3. Porto da Barra (~0.7 km)
4. Ondina (~1.2 km)
5. Amaralina (~1.8 km)
6. Stella Maris (~6.5 km)

Praias distantes:
- Praia do Forte (~42 km) ✗ fora do raio
- Maragogipe (~25 km) ✗ fora do raio

Validar:
✓ Todas as próximas (< 10km) aparecem
✓ Nenhuma distante (> 10km) aparece
✓ Distâncias estão corretas (±0.5km de erro é ok)
```

### Cenário 4: Atualização em Tempo Real

```
1. Iniciar app
2. Abrir DevTools → Geolocation simulator
3. Simular movimento (ex: Salvador → Camaçari)
4. ✓ Mapa deve atualizar a cada ~10s
5. ✓ Lista deve mudar conforme ponto se move
6. ✓ Sem erros no console
```

### Cenário 5: Compatibilidade Mobile

**Teste em Dispositivo Real ou Emulador**:

```
1. Abrir em telefone (iOS/Android)
2. ✓ Permissão de localização aparecer
3. ✓ Localização funcionar
4. ✓ Mapa responsivo
5. ✓ Lista scrollável
6. ✓ Sem performance lag
```

---

## ✅ Critérios de Aceitar (MVP Done)

### Frontend

- [x] User vê sua localização (ícone azul no mapa)
- [x] Praias aparecem no mapa (marcadores vermelhos ou cinzas)
- [x] Lista mostra praias ordenadas por distância
- [x] Distâncias calculadas corretamente (Haversine)
- [x] Atualiza a cada 10s (localização) e 30s (praias)
- [x] Sem erros no console
- [x] Mobile-friendly (responsivo)

### Backend

- [x] GET `/api/beaches` retorna 200 com array
- [x] 10 praias no JSON
- [x] Coordenadas válidas
- [x] CORS headers presentes

### UX

- [x] Permissão geolocation solicitada com contexto
- [x] Feedback visual quando carregando
- [x] Mensagem quando nenhuma praia encontrada
- [x] Círculo 10km visível no mapa

---

## 📊 Métricas de Sucess

| Métrica | Target | Medição |
|---------|--------|---------|
| **Time to First Beach** | <2s | Desde abrir até ver praia |
| **Location Update Latency** | <500ms | Desde GPS até render |
| **API Response Time** | <200ms | GET /api/beaches |
| **Memory Usage** | <30MB | Geolocation + mapa |
| **Bundle Size** | <500KB | JS total (gzipped) |
| **Console Errors** | 0 | No warnings |

---

## 🔍 Debug & Troubleshooting

### Geolocation não funciona

```
Checklist:
✓ Browser suporta Geolocation API
✓ HTTPS ou localhost (required)
✓ Permissão foi concedida
✓ GPS/Location services ligados (mobile)

Debug:
console.log('Geolocation supported:', !!navigator.geolocation);
navigator.geolocation.getCurrentPosition(
  pos => console.log('Position:', pos),
  err => console.error('Error:', err)
);
```

### Praias não são próximas

```
Checklist:
✓ Haversine cálculo correto
✓ Raio de 10km setting
✓ Coordenadas válidas (lat: -90~90, lng: -180~180)

Debug:
import { calculateDistance } from './utils/distance';
const dist = calculateDistance(-12.9689, -38.5182, -12.9634, -38.5105);
console.log('Distance:', dist); // Should be ~0.6km
```

### Mapa não renderiza

```
Checklist:
✓ Google Maps API Key válida
✓ Key tem permissão para Maps JS API
✓ Container div existe e é visível
✓ Coordenadas válidas

Debug:
console.log('API Key:', import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
```

---

## 🚀 Roadmap Futuro

### v1.1 (Próximo Sprint)
- [ ] Expands para 50+ praias
- [ ] Múltiplas regiões (SP, RJ)
- [ ] Raio dinâmico (slider)
- [ ] Filtros simples

### v1.2 (2 semanas)
- [ ] Dados de condição da praia (temperatura, ondas)
- [ ] Favoritos (LocalStorage)
- [ ] Dark mode

### v2 (Q3 2026)
- [ ] Socket.io real-time
- [ ] PostgreSQL + PostGIS
- [ ] Admin panel
- [ ] Autenticação
- [ ] Histórico de visitas

### v3+ (Futuro)
- [ ] Machine learning recomendações
- [ ] Social features (compartilhar, reviews)
- [ ] Integração com serviços de clima

---

## 📝 Notas Implementação

### Performance

- ✓ Cache praias em state (mínimo re-fetch)
- ✓ Lazy load mapa JS API
- ✓ Memoize filterNearbyBeaches
- ✓ Debounce location updates (opcional)

### Acessibilidade

- ✓ Markers com títulos (a11y)
- ✓ Labels sem dependência de cor
- ✓ Keyboard navigation (mapa)
- ✓ Alt text em ícones

### Segurança MVP

- ✓ Validar coordenadas range
- ✓ Sanitizar beach names
- ✓ CORS headers corretos
- → Autenticação em v2

### Mobile

- ✓ Touch-friendly buttons
- ✓ Responsive layout
- ✓ Otimizar loads
- ✓ Battery aware (enableHighAccuracy)

---

## 📞 Suporte & Help

**Em caso de dúvidas**:
1. Verificar specs correspondentes
2. Checker console.error / DevTools
3. Testar isoladamente (distance, geoloc, API)
4. Commitar progresso e pedir review

---

**Status**: Pronto para começar! ✅
