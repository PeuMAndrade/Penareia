# 🔧 Spec - Decisões Técnicas

**Referência**: [SPEC_INDEX.md](SPEC_INDEX.md)

---

## 🎯 Decisões Técnicas Principais

### 1. Real-time: Polling HTTP vs Socket.io

| Aspecto | Polling HTTP | Socket.io | Decisão |
|--------|-------------|-----------|---------|
| **Complexidade** | Simples ✓ | Complexo | ✓ Polling |
| **Latência** | ~30s | <100ms | Trade-off: 30s é aceitável para MVP |
| **Escalabilidade** | Baixa carga | Alta | Não prioridade MVP |
| **DevOps** | Trivial | Requer setup | ✓ Polling |
| **Debug** | Fácil | Complexo | ✓ Polling |

**Decisão**: **Polling a cada 30s via Axios**
- ✓ MVP rápido
- ✓ Sem complexidade servidor
- ✓ Fácil de debugar
- → Socket.io em v2

---

### 2. Geospatial Query: Backend vs Frontend

| Aspecto | Backend (PostgreSQL+PostGIS) | Frontend (Haversine) | Decisão |
|--------|-----|-----|---------|
| **Praias** | Query dinâmica | Pre-load em memória | ✓ Frontend (10 praias) |
| **Latência** | >100ms | <10ms | ✓ Frontend |
| **Complexidade** | Alta (PostgreSQL setup) | Simples | ✓ Frontend |
| **Escalabilidade** | Excelente | Limitada a ~10k praias | OK para MVP |

**Decisão**: **Haversine em JavaScript (Cliente)**
- ✓ Calcula distância em <10ms
- ✓ 10 praias pré-carregadas
- ✓ Sem query banco de dados
- → Backend geospatial em v2

---

### 3. Dataset: Quantidade

| Quantidade | Caso de Uso | Decisão |
|-----------|-----------|---------|
| 3-5 | Teste unitário | Pequeno demais |
| **10** | **MVP testável** | ✓ Ideal |
| 50+ | Versão 2 | Futura |
| 1000+ | Produção | Futura |

**Decisão**: **10 praias seed**
- ✓ Cobre bem a região
- ✓ Fácil criar dados fictícios/reais
- ✓ Sem overhead performance
- → Expande para 50+ em v2

---

### 4. Região: Foco Geográfico

| Região | Praias | Complexidade | Decisão |
|--------|--------|-------------|---------|
| **Bahia** | ~200+ | Média | ✓ Foco MVP |
| Brasil Inteiro | 2000+ | Alta | Futura |
| SP + RJ | 500+ | Alta | v2 |

**Decisão**: **Bahia (Litoral)**
- ✓ Região coesa
- ✓ ~10 praias representativas
- ✓ Coordenadas não mudam
- → Expande para outras regiões em v2

---

### 5. Raio de Busca: Fixo vs Dinâmico

| Tipo | Raio | Decisão |
|------|------|---------|
| **Fixo** | **10km** | ✓ MVP |
| Dinâmico | 5-50km (slider) | v2 |

**Decisão**: **10km fixo**
- ✓ Similar ao Uber (inicialmente 5-15km)
- ✓ Sem UI para controlar
- → Parametrizável em v2

---

### 6. Localização do User: watchPosition vs getCurrentPosition

| Método | Atualização | Caso | Decisão |
|--------|------------|------|---------|
| `getCurrentPosition()` | Uma vez | "Onde estou?" | ✗ Não |
| **`watchPosition()`** | **Contínua** | **"Em tempo real"** | **✓ Sim** |

**Decisão**: **`watchPosition()` nativa**
- ✓ Atualiza continuamente
- ✓ Econômico (bateria)
- ✓ API nativa do navegador
- ✓ Intervalo: 10s

---

### 7. Intervalo de Atualização

| Intervalo | Bateria | Precisão | Decisão |
|-----------|---------|----------|---------|
| 3s | ✗✗ Péssimo | Ótimo | ✗ Não |
| **10s** | ✓ Bom | ✓ Bom | **✓ Geolocation** |
| 30s | ✓✓ Excelente | Médio | ✓ Polling API |
| 60s | ✓✓✓ Máximo | Ruim | ✗ Não |

**Decisão**:
- **Geolocation**: 10s (watchPosition)
- **Praias API**: 30s (Polling)
- Trade-off: Bateria vs Precisão

---

### 8. Armazenamento: Dados Estáticos vs Dinâmicos

| Dados | Tipo | Storage | Decisão |
|-------|------|---------|---------|
| Praias | Estático | JSON hardcoded | ✓ MVP |
| User Location | Dinâmico | React State | ✓ MVP |
| Histórico | Dinâmico | Firestore | v2 |
| Favoritos | Dinâmico | LocalStorage | v2 |

**Decisão**: 
- **JSON hardcoded** para praias (0 overhead)
- **React State** para posição user (re-render eficiente)

---

### 9. Maps: Google Maps Strategy

| Aspecto | Decisão | Justificativa |
|--------|---------|---------------|
| **Provider** | Google Maps | Já integrado no projeto |
| **Library** | `@googlemaps/js-api-loader` | Já usando |
| **Features MVP** | Base map + Markers | Não precisa routing |
| **Círculo 10km** | `google.maps.Circle` | Nativo API |
| **Clusters** | Não (10 praias) | v2 |

---

### 10. Performance: Otimizações

| Aspecto | Otimização | Impacto |
|--------|-----------|--------|
| **Bundle** | Tree-shake unused Google Maps APIs | <5% da API |
| **Memory** | Reusar marcadores (não recriar) | ~50KB economizado |
| **Render** | useMemo para calcular distâncias | ~30% menos re-renders |
| **Network** | Cache praias por 5min | 6 menos requests/hora |

---

## 📊 Matriz de Trade-offs

```
┌─────────────────────────────────────────────────────┐
│ TRADE-OFF: Simplicidade vs Funcionalidade           │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Polling (30s) ───────── Simples                     │
│                         ↓                           │
│                    MVP Viável                       │
│                         ↓                           │
│ Socket.io (Real-time) ─ Complexo                    │
│                                                     │
│ Prioridade: Entregar em 4-5h > Perfeição           │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 Princípios Guia

1. **MVP First**: Priorizar entrega rápida
2. **YAGNI**: "You Ain't Gonna Need It" - não adicione Socket.io agora
3. **Simple is Better**: Haversine JS vs Backend query
4. **Native APIs**: Use browser APIs antes de libs
5. **Progressive Enhancement**: v2 adiciona features

---

## 🚀 Roadmap Implícito

```
MVP (Agora)
├─ Polling 30s
├─ Haversine
├─ 10 praias
├─ Bahia
└─ Raio 10km fixo

v1.1 (Próximo mês)
├─ Mais regiões (SP, RJ)
├─ 50+ praias
├─ Raio dinâmico (slider)
└─ Filtros básicos

v2 (Q3 2026)
├─ Socket.io real-time
├─ PostgreSQL + PostGIS
├─ Condições de praia (ondas, temp)
├─ Favoritos + histórico
└─ Notificações
```

---

**Próximo**: [SPEC_ARCHITECTURE.md](SPEC_ARCHITECTURE.md)
