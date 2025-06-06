# Control Car - Sistema de Gestão de Veículos

Sistema completo para gestão de veículos, incluindo controle de estoque, manutenção, vendas e relatórios.

## 🚀 Funcionalidades

- **Gestão de Veículos**
  - Cadastro completo de veículos
  - Controle de estoque
  - Histórico de manutenções
  - Rastreamento de status

- **Gestão de Clientes**
  - Cadastro de clientes
  - Histórico de compras
  - Documentação digital
  - Comunicação integrada

- **Gestão Financeira**
  - Controle de vendas
  - Parcelamento
  - Relatórios financeiros
  - Integração com sistemas fiscais

- **Manutenção**
  - Agendamento de serviços
  - Ordem de serviço
  - Controle de peças
  - Histórico de manutenções

- **Segurança e Auditoria**
  - Autenticação robusta
  - Controle de acesso
  - Logs de auditoria
  - Backup automático

## 🛠️ Tecnologias

### Backend
- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Swagger/OpenAPI
- Winston Logger
- Cache Manager
- Nodemailer

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- React Query
- React Hook Form
- Radix UI
- Chart.js

### DevOps
- Docker
- GitHub Actions
- Prometheus
- Grafana

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- pnpm 8+ (ou npm 9+ ou yarn 1.22+)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Isllanrx/control-car.git
cd control-car
```

2. Instale as dependências:
```bash
# Backend
cd backend
pnpm install

# Frontend
cd ../frontend
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
# Backend
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Frontend
cp .env.example .env.local
# Edite o arquivo .env.local com suas configurações
```

4. Execute as migrações do banco de dados:
```bash
cd backend
pnpm prisma migrate dev
```

5. Inicie os serviços:
```bash
# Backend
cd backend
pnpm start:dev

# Frontend
cd frontend
pnpm dev
```

## 📚 Documentação

A documentação da API está disponível em:
- Swagger UI: `http://localhost:3000/api/docs`
- OpenAPI JSON: `http://localhost:3000/api-json`

## 🔍 Monitoramento

- Health Check: `http://localhost:3000/health`
- Métricas Prometheus: `http://localhost:3000/metrics`
- Dashboard Grafana: `http://localhost:3000/grafana`

## 🧪 Testes

```bash
# Backend
cd backend
pnpm test
pnpm test:e2e

# Frontend
cd frontend
pnpm test
```

## 📦 Deploy

1. Construa as imagens Docker:
```bash
docker-compose build
```

2. Inicie os containers:
```bash
docker-compose up -d
```

## 🔐 Segurança

- Autenticação JWT
- Rate Limiting
- Validação de dados
- Sanitização de inputs
- Proteção contra CSRF
- Headers de segurança
- Logs de auditoria
- Backup automático

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua branch de feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
