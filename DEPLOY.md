# Deploy no Vercel

## Checklist de Configuração

### 1. Preparar o Repositório
```bash
# Commitar as mudanças
git add .
git commit -m "Config Vercel: corrigir vercel.json e adicionar .vercelignore"
git push -u origin main
```

### 2. Conectar no Painel Vercel
1. Acesse [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Clique em **"Add New..."** → **"Project"**
3. Selecione seu repositório `penaareia/pé-na-areia`
4. Vercel detectará as settings automáticamente

### 3. Definir Variáveis de Ambiente
No painel Vercel, vá a **Settings** → **Environment Variables** e adicione:

```
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBZy-VApYzqCF7gaAKML9nQV_gQ_b04VrQ
STORMGLASS_API_KEY=(sua chave, opcional)
GEMINI_API_KEY=(sua chave, opcional)
```

**Importante:** Variáveis começando com `VITE_` são expostas ao cliente (JavaScript) automaticamente no build.

### 4. Confirmar Build Settings
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm ci`

### 5. Deploy
Clique em **Deploy** e aguarde.

---

## Solução de Problemas

### Tela Branca (Blank Page)
**Causa:** Build falhou, assets não foram servidos, ou erro no JS.

**Solução:**
1. Verifique os logs no painel Vercel (clique no deployment)
2. Procure por erros de build ou runtime
3. Abra DevTools (F12) e verifique:
   - **Console:** Há erros em vermelho?
   - **Network:** Os assets `.js` e `.css` carregaram?
   - **Sources:** Verifique se `dist/` foi gerado

### Erro 404 nas APIs
**Causa:** As funções serverless em `api/` podem não estar sendo reconhecidas.

**Solução:**
1. Verifique se os arquivos em `api/` existem
2. Confirme que os nomes dos arquivos correspondem ao padrão esperado:
   - `api/beaches.ts` → GET `/api/beaches`
   - `api/recommendation.ts` → POST `/api/recommendation`
   - `api/beach-conditions/[lat]/[lng].ts` → GET `/api/beach-conditions/:lat/:lng`
3. Se ainda não funcionar, considere usar um backend separado ou mover a lógica para o frontend

### Erro de Timeout nas Funções Serverless
**Causa:** APIs externas (Stormglass, Gemini) estão lentas.

**Solução:**
- Aumente o timeout em **Settings** → **Functions** (máximo 60s no plano Pro)
- Implemente caching local no cliente
- Considere usar middleware/proxy

---

## Dicas de Produção

1. **Variáveis Sensíveis:** Nunca exponha chaves no código; sempre use `.env` e Vercel secrets
2. **Logs:** Use `console.log` nas funções serverless (aparecem nos logs do deployment)
3. **Monitoramento:** Configure integração com Sentry, DataDog, ou similar
4. **Backup do Banco:** Se usar DB, configure backups automáticos

---

## Links Úteis
- [Vercel Docs](https://vercel.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [Vercel Functions](https://vercel.com/docs/functions/serverless-functions)
