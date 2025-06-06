# Estrutura do Projeto

## Backend (`/backend`)

```
backend/
├── src/
│   ├── config/                 # Configurações do projeto
│   │   ├── database.config.ts
│   │   └── app.config.ts
│   │
│   ├── core/                   # Núcleo da aplicação
│   │   ├── decorators/        # Decoradores personalizados
│   │   ├── filters/           # Filtros de exceção
│   │   ├── guards/            # Guards de autenticação/autorização
│   │   ├── interceptors/      # Interceptores
│   │   └── pipes/             # Pipes de validação
│   │
│   ├── modules/               # Módulos da aplicação
│   │   ├── auth/             # Autenticação e autorização
│   │   ├── users/            # Gestão de usuários
│   │   ├── vehicles/         # Gestão de veículos
│   │   ├── categories/       # Categorias de produtos
│   │   ├── suppliers/        # Fornecedores
│   │   ├── transactions/     # Transações financeiras
│   │   ├── products/         # Produtos
│   │   └── reports/          # Relatórios
│   │
│   ├── shared/               # Recursos compartilhados
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── interfaces/      # Interfaces
│   │   ├── constants/       # Constantes
│   │   └── utils/           # Utilitários
│   │
│   ├── prisma/              # Configuração do Prisma
│   │   ├── schema.prisma
│   │   └── migrations/
│   │
│   └── main.ts              # Ponto de entrada da aplicação
│
├── test/                    # Testes
│   ├── e2e/
│   └── unit/
│
└── prisma/                  # Migrações e seeds do Prisma
```

## Frontend (`/frontend`)

```
frontend/
├── src/
│   ├── app/                 # Rotas e páginas (Next.js App Router)
│   │   ├── (auth)/         # Rotas de autenticação
│   │   ├── (dashboard)/    # Rotas do dashboard
│   │   └── api/            # Rotas da API
│   │
│   ├── components/         # Componentes React
│   │   ├── ui/            # Componentes de UI básicos
│   │   ├── forms/         # Componentes de formulário
│   │   ├── layout/        # Componentes de layout
│   │   └── features/      # Componentes específicos de features
│   │
│   ├── hooks/             # Custom hooks
│   │   ├── api/          # Hooks para chamadas de API
│   │   └── common/       # Hooks utilitários
│   │
│   ├── lib/              # Bibliotecas e configurações
│   │   ├── api/         # Configuração da API
│   │   ├── utils/       # Funções utilitárias
│   │   └── constants/   # Constantes
│   │
│   ├── services/        # Serviços
│   │   ├── api/        # Serviços de API
│   │   └── storage/    # Serviços de armazenamento
│   │
│   ├── styles/         # Estilos globais
│   │   ├── globals.css
│   │   └── themes/
│   │
│   └── types/          # Definições de tipos TypeScript
│
├── public/             # Arquivos estáticos
│   ├── images/
│   └── icons/
│
└── tests/             # Testes
    ├── e2e/
    └── unit/
```

## Estrutura de Módulos

Cada módulo no backend segue a seguinte estrutura:

```
modules/
└── [module-name]/
    ├── controllers/     # Controladores
    ├── services/       # Serviços
    ├── repositories/   # Repositórios
    ├── dto/           # DTOs específicos do módulo
    ├── entities/      # Entidades
    ├── interfaces/    # Interfaces
    └── [module-name].module.ts
```

## Convenções de Nomenclatura

1. **Arquivos**:
   - PascalCase para componentes React: `UserProfile.tsx`
   - camelCase para utilitários: `formatDate.ts`
   - kebab-case para arquivos de estilo: `user-profile.css`

2. **Diretórios**:
   - kebab-case para diretórios: `user-profile/`
   - camelCase para módulos: `userProfile/`

3. **Componentes**:
   - PascalCase para componentes: `UserProfile`
   - Sufixo `.tsx` para componentes React
   - Sufixo `.ts` para arquivos TypeScript

4. **Testes**:
   - Sufixo `.spec.ts` para testes unitários
   - Sufixo `.e2e-spec.ts` para testes e2e

## Boas Práticas

1. **Componentes**:
   - Um componente por arquivo
   - Props tipadas com TypeScript
   - Componentes pequenos e reutilizáveis
   - Separação de lógica e apresentação

2. **Estilos**:
   - CSS Modules ou Tailwind CSS
   - Variáveis CSS para temas
   - Responsividade mobile-first

3. **Estado**:
   - React Query para estado do servidor
   - Context API para estado global
   - useState para estado local

4. **API**:
   - Axios para requisições HTTP
   - Interceptors para tratamento de erros
   - Tipagem forte para respostas da API

5. **Segurança**:
   - Validação de dados
   - Sanitização de inputs
   - Proteção contra CSRF
   - Headers de segurança 