# 📍 Spec MVP - Geolocalização em Tempo Real

**Data**: 14 de maio de 2026  
**Versão**: 1.0 MVP  
**Status**: Em Desenvolvimento

---

## 📚 Índice de Documentação

### 🎯 Overview
- [SPEC_INDEX.md](SPEC_INDEX.md) ← Você está aqui
- [SPEC_DECISIONS.md](SPEC_DECISIONS.md) - Decisões técnicas e justificativas

### 🏗️ Arquitetura
- [SPEC_ARCHITECTURE.md](SPEC_ARCHITECTURE.md) - Diagrama, fluxo de dados, componentes

### 📡 API
- [SPEC_API.md](SPEC_API.md) - Endpoints, request/response, contratos

### 🗄️ Dados
- [SPEC_DATABASE.md](SPEC_DATABASE.md) - Dataset de praias, estrutura, seed

### 🧩 Implementação
- [SPEC_COMPONENTS.md](SPEC_COMPONENTS.md) - Componentes, hooks, utils, tipos
- [SPEC_IMPLEMENTATION.md](SPEC_IMPLEMENTATION.md) - Sprints, roadmap, testes

---

## 🎯 Objetivo

Implementar um sistema de localização em tempo real que mostra as praias mais próximas ao usuário (raio de 10km), similar ao Uber/Waze, focando inicialmente no litoral da Bahia.

---

## 📋 Quick Reference

| Aspecto | Decisão |
|--------|---------|
| Real-time | Polling HTTP a cada **30s** via Axios |
| Geospatial | Haversine em **JavaScript (Cliente)** |
| Dataset | **10 praias** de exemplo |
| Região | **Bahia (Litoral)** |
| Raio de Busca | **10km fixo** |

---

## 🚀 Como Começar

1. **Entender as decisões**: Leia [SPEC_DECISIONS.md](SPEC_DECISIONS.md)
2. **Visualizar arquitetura**: Veja [SPEC_ARCHITECTURE.md](SPEC_ARCHITECTURE.md)
3. **Conhecer API**: Revise [SPEC_API.md](SPEC_API.md)
4. **Dados**: Confira [SPEC_DATABASE.md](SPEC_DATABASE.md)
5. **Componentes**: Estude [SPEC_COMPONENTS.md](SPEC_COMPONENTS.md)
6. **Implementar**: Siga [SPEC_IMPLEMENTATION.md](SPEC_IMPLEMENTATION.md)

---

## 📁 Estrutura de Diretórios

```
docs/
├── SPEC_INDEX.md              ← Você está aqui
├── SPEC_DECISIONS.md          Decisões técnicas
├── SPEC_ARCHITECTURE.md       Arquitetura & diagrama
├── SPEC_API.md                Endpoints
├── SPEC_DATABASE.md           Dataset e estrutura
├── SPEC_COMPONENTS.md         Componentes & utils
└── SPEC_IMPLEMENTATION.md     Sprints & testes
```

---

## ⏱️ Tempo Estimado

- **Backend**: 30 min
- **Utils**: 20 min
- **Hooks**: 30 min
- **Componentes**: 1.5h
- **Integração**: 1h

**Total MVP**: ~4-5 horas

---

## ✅ Entregáveis MVP

1. ✓ User vê sua localização no mapa (ícone azul)
2. ✓ Praias de Bahia aparecem no mapa (marcadores vermelhos)
3. ✓ Lista mostra praias ordenadas por proximidade
4. ✓ Distância calculada corretamente (Haversine)
5. ✓ Atualiza a cada 10s (localização) e 30s (praias)
6. ✓ Sem erros no console
7. ✓ Funciona em mobile (permissões)

---

## 🔗 Links Rápidos

- [Decisões Técnicas](SPEC_DECISIONS.md)
- [Arquitetura e Diagrama](SPEC_ARCHITECTURE.md)
- [API Endpoints](SPEC_API.md)
- [Dataset de Dados](SPEC_DATABASE.md)
- [Componentes e Utils](SPEC_COMPONENTS.md)
- [Plano de Implementação](SPEC_IMPLEMENTATION.md)
