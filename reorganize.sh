#!/bin/bash

# Criar estrutura de diretórios do backend
mkdir -p backend/src/{config,core/{decorators,filters,guards,interceptors,pipes},modules/{auth,users,vehicles,categories,suppliers,transactions,products,reports},shared/{dto,interfaces,constants,utils},prisma,test/{e2e,unit}}

# Criar estrutura de diretórios do frontend
mkdir -p frontend/src/{app/{auth,dashboard,api},components/{ui,forms,layout,features},hooks/{api,common},lib/{api,utils,constants},services/{api,storage},styles/themes,types,public/{images,icons},tests/{e2e,unit}}

# Mover arquivos do backend para suas novas localizações
mv backend/src/auth/* backend/src/modules/auth/ 2>/dev/null
mv backend/src/vehicles/* backend/src/modules/vehicles/ 2>/dev/null
mv backend/src/categoria/* backend/src/modules/categories/ 2>/dev/null
mv backend/src/fornecedor/* backend/src/modules/suppliers/ 2>/dev/null
mv backend/src/movimentacao/* backend/src/modules/transactions/ 2>/dev/null
mv backend/src/produto/* backend/src/modules/products/ 2>/dev/null
mv backend/src/usuario/* backend/src/modules/users/ 2>/dev/null

# Mover arquivos do frontend para suas novas localizações
mv frontend/app/login/* frontend/src/app/auth/ 2>/dev/null
mv frontend/app/register/* frontend/src/app/auth/ 2>/dev/null
mv frontend/app/categorias/* frontend/src/app/dashboard/categories/ 2>/dev/null
mv frontend/app/fornecedores/* frontend/src/app/dashboard/suppliers/ 2>/dev/null
mv frontend/app/movimentacoes/* frontend/src/app/dashboard/transactions/ 2>/dev/null
mv frontend/app/produtos/* frontend/src/app/dashboard/products/ 2>/dev/null
mv frontend/app/usuarios/* frontend/src/app/dashboard/users/ 2>/dev/null

# Criar arquivos de configuração base
touch backend/src/config/{database.config.ts,app.config.ts}
touch frontend/src/lib/api/axios.config.ts
touch frontend/src/lib/constants/app.constants.ts

# Criar arquivos de tipos base
touch frontend/src/types/{api.types.ts,common.types.ts}

# Criar arquivos de estilo base
touch frontend/src/styles/themes/{light.ts,dark.ts}

echo "Estrutura de diretórios reorganizada com sucesso!" 