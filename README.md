# Dedo Duro do GitHub

Radar web para monitorar de forma implacável a atividade de colaboradores em organizações do GitHub. Identifica rapidamente quem está parado e quem está sobrecarregado, com métricas objetivas e insights para equilibrar a squad.

## ⚙️ Tecnologias

- [Next.js 14 (App Router)](https://nextjs.org/)
- React 18 + TypeScript
- API Routes para integração com o GitHub

## 🚀 Como rodar

1. Crie um token pessoal do GitHub com os escopos `repo`, `read:org` e `read:user`.
2. Copie `.env.local.example` para `.env.local` e informe o token:
   ```bash
   cp .env.local.example .env.local
   ```
3. Instale dependências e suba o servidor:
   ```bash
   npm install
   npm run dev
   ```
4. Acesse `http://localhost:3000`.

## 🛰️ Deploy

Com o token já configurado nas variáveis de ambiente do projeto na Vercel:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-537ef5c7
```

Depois valide:

```bash
curl https://agentic-537ef5c7.vercel.app
```

## 🕵️‍♂️ Como funciona

- **Coleta** eventos recentes (`Push`, `PullRequest`, `Review`, `Issues`, etc.) em `/users/:login/events/orgs/:org`.
- **Pontuação** pondera commits, reviews, merges e interações.
- **Classificação** marca automaticamente colaboradores como `subutilizado`, `equilibrado` ou `sobrecarregado`.
- **Insights** destacam gargalos: PRs travadas, falta de review, concentração de esforço em poucas pessoas.

## 📌 Observações

- Sem lista de logins, o app busca todos os membros públicos da organização (até 150).
- A janela de análise é configurável (7 a 90 dias).
- Logs de erros aparecem no terminal do servidor, úteis para tokens insuficientes ou permissões faltando.
