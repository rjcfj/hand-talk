# HandTalk Accessibility

Uma plataforma para análise de acessibilidade de páginas web, utilizando **Puppeteer**, **axe-core** e **MongoDB**, com frontend em **Vue 3 + Vite** e backend em **Node.js + Express + TypeScript**. O projeto permite automatizar a detecção de problemas de acessibilidade e fornece uma interface em tempo real para monitoramento das análises.

---

## 🎯 Objetivo do Projeto

O HandTalk Accessibility tem como objetivo principal:

- Automatizar a análise de páginas web para verificar problemas de acessibilidade (por exemplo, contraste insuficiente, elementos sem ARIA, etc.).
- Fornecer feedback em tempo real via **WebSocket** sobre o status da análise.
- Armazenar resultados em **MongoDB** para consulta futura.
- Ser facilmente integrável em ambientes de desenvolvimento, CI/CD ou pipelines de testes de acessibilidade.

---

## 📁 Estrutura do Projeto
```
hand-talk/
├─ backend/
│ ├─ src/
│ │ ├─ controllers/
│ │ │ └─ analysisController.ts
│ │ ├─ models/
│ │ │ └─ Analysis.ts
│ │ ├─ routes/
│ │ │ └─ analysisRoutes.ts
│ │ ├─ app.ts
│ │ └─ server.ts
│ ├─ package.json
│ └─ tsconfig.json
├─ frontend/
│ ├─ src/
│ │ ├─ components/
│ │ │ └─ AnalysisResults.vue
│ │ ├─ views/
│ │ ├─ App.vue
│ │ └─ main.ts
│ ├─ package.json
│ └─ vite.config.ts
├─ docker-compose.yml
├─ .env
└─ README.md
```


---

## ⚙️ Tecnologias Utilizadas

**Backend:**
- Node.js 22 + TypeScript
- Express.js
- Puppeteer (para renderizar páginas e injetar `axe-core`)
- axe-core (análise de acessibilidade)
- Mongoose + MongoDB

**Frontend:**
- Vue 3 + TypeScript + Vite
- TailwindCSS (estilização)
- WebSockets (Socket.io) para status em tempo real

**Infraestrutura:**
- Docker + Docker Compose para orquestração de backend, frontend e banco de dados
- pnpm como gerenciador de pacotes monorepo
- CI/CD-ready (testes paralelos com Vitest)

---

## 📝 Funcionalidades Principais

- **Analisar página web**: recebe URL, executa Puppeteer + axe-core e retorna violação de acessibilidade.
- **Emitir status em tempo real**: carregando, analisando, salvando, concluído.
- **Salvar resultados no MongoDB**.
- **Consultar histórico de análises**.
- **Testes unitários e integração**: backend e frontend testados com Vitest.

---

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js >= 22
- pnpm >= 10
- Docker e Docker Compose
- MongoDB (ou container Docker)

### Configuração do .env

Crie um arquivo `.env` na raiz do backend:

```
MONGO_URI=mongodb://mongo:27017/handtalk_accessibility
PORT=4000
```


### Instalação das dependências

No monorepo:

```
bash
pnpm install
```

### Executando localmente (dev)
```
cd backend
pnpm dev
```

### Executando localmente (dev)
```
cd frontend
pnpm dev
```

Acesse http://localhost:5173

### Executando via Docker
```
docker-compose up -d --build
```

O frontend estará disponível em http://localhost:5173 e o backend em http://localhost:4000.

### 🧪 Testes

Testes são executados em monorepo, paralelamente:
```
pnpm -r --parallel test

```

* Backend: testes com Vitest e mocks de Puppeteer
* Frontend: testes de componentes Vue com Vitest + Vue Test Utils

Resultados são exibidos de forma consolidada por workspace.


### 🔧 Considerações Técnicas

* Puppeteer com axe-core: garante execução headless segura e coleta detalhada de violação de acessibilidade.

* WebSockets: io.emit opcional no controller, usado apenas quando conectado.

* Arquitetura limpa: createApp() no backend separa configuração do servidor da execução, permitindo testes unitários.

* Docker & pnpm: monorepo isolado, evitando conflitos entre frontend e backend, imagens otimizadas para rebuild incremental.

* Tratamento de erros robusto: envio de status error via socket e respostas HTTP padronizadas.

* Extensibilidade: facilmente adicionar novas regras de análise, novos relatórios ou integração com CI/CD.

### ⚠️ Problemas Comuns e Soluções

* MONGO_URI não está definido: verifique se o arquivo .env está carregado.

* Cannot find module vite/bin/vite.js: execute pnpm install dentro do workspace frontend.

* docker COPY node_modules: evite copiar node_modules no Docker, use COPY package.json pnpm-lock.yaml ./ + pnpm install.

* Conexão Mongo falhando no Docker: use o nome do serviço mongo no docker-compose.yml para o MONGO_URI.

### 📌 Conclusão

 Este projeto demonstra:

* Automação completa de acessibilidade

* Arquitetura moderna para monorepo (frontend + backend)

* Boas práticas em TypeScript, Docker, pnpm e testes

* Foco em feedback em tempo real e rastreabilidade de dados.