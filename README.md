# 💪 Back Fit Planner

Uma API completa para planejamento e acompanhamento de treinos, desenvolvida com NestJS seguindo os princípios da Clean Architecture.

## 🏗️ Arquitetura

Este projeto segue os princípios da **Clean Architecture**, organizando o código em camadas bem definidas:

- **Entities**: Regras de negócio e entidades do domínio
- **Use Cases**: Casos de uso e regras de aplicação
- **Controllers**: Interface de entrada (HTTP/REST)
- **Frameworks**: Integrações externas (banco de dados, bibliotecas)

## 🎯 Funcionalidades

### 🔐 Autenticação

- [x] Estrutura base
- [x] Criar conta de usuário
- [x] Login na conta
- [x] Geração de tokens JWT
- [x] Validação de tokens
- [ ] Refresh token
- [ ] Recuperação de senha (esqueci senha)

### 👤 Perfil

- [x] Obter perfil do usuário logado
- [x] Obter perfil por ID
- [x] Buscar perfis por username/nome
- [x] Atualizar informações do perfil
- [ ] Upload de foto de perfil

### 🏋️ Treinos

- [x] Criar plano de treino
- [x] Obter plano de treino por ID
- [x] Criar dias de treino (segunda, terça, etc.)
- [x] Obter dias de treino
- [x] Criar exercícios dentro dos dias
- [x] Obter exercícios por dia
- [x] Registrar peso utilizado por exercício
- [x] Sistema de ordem dos exercícios
- [ ] Listar todos os treinos do usuário
- [ ] Listar todos os treinos (feed público)
- [ ] Salvar treino como favorito
- [ ] Curtir treinos de outros usuários
- [ ] Compartilhamento de treinos

## 🛠️ Stack Tecnológica

- **Framework**: NestJS
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL ✅
- **ORM**: Prisma ✅
- **Autenticação**: JWT
- **Validação**: class-validator ✅
- **Documentação**: Swagger
- **Testes**: Jest
- **Linting**: ESLint + Biome ✅

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- pnpm

### Instalação

```bash
# Instalar dependências
pnpm install
```

### Executar em Desenvolvimento

```bash
# Modo desenvolvimento
pnpm run start:dev

# Modo watch
pnpm run start

# Modo produção
pnpm run start:prod
```

### Testes

```bash
# Testes unitários
pnpm run test

# Testes e2e
pnpm run test:e2e

# Coverage dos testes
pnpm run test:cov
```

## 📁 Estrutura do Projeto

```
src/
├── core/                    # Camada de domínio
│   ├── entities/           # Entidades do negócio
│   └── dtos/              # Data Transfer Objects
├── use-cases/             # Casos de uso da aplicação
├── controllers/           # Controladores HTTP
├── services/             # Serviços da aplicação
├── frameworks/           # Integrações externas
└── configuration/        # Configurações da aplicação
```

## 🗓️ Roadmap de Desenvolvimento

### Sprint 1 - Fundação (Semana 1-2) ✅ CONCLUÍDA

- [x] Configurar banco de dados PostgreSQL
- [x] Implementar entidades User e Profile
- [x] Sistema básico de autenticação (registro/login)
- [x] Middleware de validação JWT

### Sprint 2 - Perfil de Usuário (Semana 3) ✅ CONCLUÍDA

- [x] CRUD completo de perfis
- [x] Busca por usuários
- [x] Validações de dados do perfil

### Sprint 3 - Treinos Básicos (Semana 4-5) ✅ CONCLUÍDA

- [x] Entidades WorkoutPlan, WorkoutDay e Exercise
- [x] CRUD completo de planos de treino
- [x] CRUD de dias de treino
- [x] CRUD de exercícios
- [x] Associação treino-usuário
- [x] Sistema completo de exercícios com peso e ordem

### Sprint 4 - Funcionalidades Sociais (Semana 6) ✅ CONCLUÍDA

- [x] Sistema de curtidas em planos de treino
- [x] Sistema de favoritar treinos
- [x] Feed público de treinos para descoberta
- [x] Sistema de seguir outros usuários
- [x] Estatísticas sociais (seguidores, seguindo, curtidas)
- [x] Listagem de seguidores e seguidos

### Sprint 5 - Métricas e Analytics (Semana 7) ✅ CONCLUÍDA

- [x] Registro simples de peso por exercício
- [x] Histórico de progressão de peso
- [x] Consulta de registros por exercício
- [x] Resumo de progresso do usuário
- [x] CRUD completo de registros de peso

### Sprint 6 - Polimento (Semana 8)

- [ ] Documentação Swagger completa
- [ ] Testes de integração
- [ ] Otimizações de performance
- [ ] Deploy e CI/CD

## 📋 Próximos Passos

1. ~~**Configurar Banco de Dados**: Adicionar PostgreSQL e Prisma~~ ✅ **CONCLUÍDO**
2. ~~**Implementar Autenticação**: JWT, bcrypt, guards~~ ✅ **CONCLUÍDO**
3. ~~**Criar Entidades**: User, Profile, WorkoutPlan, WorkoutDay, Exercise~~ ✅ **CONCLUÍDO**
4. ~~**Desenvolver Use Cases**: Seguindo princípios da Clean Architecture~~ ✅ **CONCLUÍDO**
5. ~~**Implementar CRUD de Perfis**: Get, Update, Search~~ ✅ **CONCLUÍDO**
6. ~~**Implementar Sistema de Treinos**: CRUD completo de planos, dias e exercícios~~ ✅ **CONCLUÍDO**
7. ~~**Implementar Funcionalidades Sociais**: Curtidas, favoritos, seguidores e feed público~~ ✅ **CONCLUÍDO**
8. ~~**Implementar Sistema de Métricas**: Tracking simples de peso por exercício~~ ✅ **CONCLUÍDO**
9. **Documentar API**: Swagger/OpenAPI
10. **Escrever Testes**: Cobertura mínima de 80%

### 🎯 **SPRINT 1, 2, 3, 4 & 5 CONCLUÍDAS COM SUCESSO!**

✅ **O que está funcionando:**

- Banco PostgreSQL com Docker
- Autenticação completa (registro/login)
- JWT tokens e guards
- Entidades User, Profile, WorkoutPlan, WorkoutDay, Exercise + Like, Favorite, Follow + ExerciseRecord
- Clean Architecture implementada
- Validações com class-validator + decorator customizado @BodyDto
- **CRUD completo de perfis** (GET, PUT /profile/me)
- **Busca de usuários** (GET /profile/search)
- **Perfil por ID/username** (GET /profile/:identifier)
- **Sistema completo de treinos:**
  - **CRUD de planos de treino** (POST, GET /workout-plans)
  - **CRUD de dias de treino** (POST /workout-plans/:id/days)
  - **CRUD de exercícios** (POST /workout-days/:id/exercises)
  - **Sistema de peso e ordem dos exercícios**
- **Funcionalidades sociais completas:**
  - **Sistema de curtidas** (POST/DELETE /social/workout-plans/:id/like)
  - **Sistema de favoritos** (POST/DELETE /social/workout-plans/:id/favorite)
  - **Sistema de seguir usuários** (POST/DELETE /social/users/:id/follow)
  - **Feed público de treinos** (GET /social/feed)
  - **Estatísticas sociais** (GET /social/stats)
  - **Listagem de seguidores/seguindo** (GET /social/users/:id/followers|following)
- **Sistema de métricas simples:**
  - **Registro de peso por exercício** (POST /metrics/records)
  - **Histórico de progressão** (GET /metrics/exercises/:id/progress)
  - **Resumo de progresso** (GET /metrics/summary)
  - **CRUD de registros** (PUT/DELETE /metrics/records/:id)

### 🚀 **Como testar:**

```bash
# Iniciar banco
pnpm docker:up

# Rodar migrations
pnpm db:migrate

# Iniciar servidor
pnpm start:dev

# Testar endpoints
POST /auth/register
POST /auth/login
GET /profile/me
PUT /profile/me
GET /profile/search?q=nome
GET /profile/:identifier

# Endpoints de treinos
POST /workout-plans
GET /workout-plans/:id
POST /workout-plans/:planId/days
POST /workout-days/:dayId/exercises

# Endpoints sociais
POST /social/workout-plans/:id/like
DELETE /social/workout-plans/:id/like
POST /social/workout-plans/:id/favorite
DELETE /social/workout-plans/:id/favorite
GET /social/favorites
POST /social/users/:id/follow
DELETE /social/users/:id/follow
GET /social/users/:id/followers
GET /social/users/:id/following
GET /social/feed
GET /social/stats/:id
GET /social/stats

# Endpoints de métricas
POST /metrics/records
PUT /metrics/records/:id
DELETE /metrics/records/:id
GET /metrics/exercises/:exerciseId/progress
GET /metrics/summary
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

⭐ **Desenvolvido com Clean Architecture + NestJS**
