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
- [ ] Criar conta de usuário
- [ ] Login na conta
- [ ] Geração de tokens JWT
- [ ] Validação de tokens
- [ ] Refresh token
- [ ] Recuperação de senha (esqueci senha)

### 👤 Perfil
- [ ] Obter perfil do usuário logado
- [ ] Obter perfil por ID
- [ ] Buscar perfis por username/nome
- [ ] Atualizar informações do perfil
- [ ] Upload de foto de perfil

### 🏋️ Treinos
- [ ] Listar treinos do usuário
- [ ] Obter treinos por ID do usuário
- [ ] Listar todos os treinos (feed público)
- [ ] Criar novo treino
- [ ] Salvar treino como favorito
- [ ] Curtir treinos de outros usuários
- [ ] Registrar peso utilizado por exercício
- [ ] Compartilhamento de treinos

## 🛠️ Stack Tecnológica

- **Framework**: NestJS
- **Linguagem**: TypeScript
- **Banco de Dados**: PostgreSQL (planejado)
- **ORM**: Prisma (planejado)  
- **Autenticação**: JWT
- **Validação**: class-validator
- **Documentação**: Swagger
- **Testes**: Jest
- **Linting**: ESLint + Biome

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

### Sprint 1 - Fundação (Semana 1-2)
- [ ] Configurar banco de dados PostgreSQL
- [ ] Implementar entidades User e Profile
- [ ] Sistema básico de autenticação (registro/login)
- [ ] Middleware de validação JWT

### Sprint 2 - Perfil de Usuário (Semana 3)
- [ ] CRUD completo de perfis
- [ ] Busca por usuários
- [ ] Validações de dados do perfil

### Sprint 3 - Treinos Básicos (Semana 4-5)
- [ ] Entidade Workout (Treino)
- [ ] CRUD de treinos
- [ ] Associação treino-usuário
- [ ] Sistema de exercícios

### Sprint 4 - Funcionalidades Sociais (Semana 6)
- [ ] Sistema de curtidas
- [ ] Salvar treinos favoritos
- [ ] Feed público de treinos
- [ ] Sistema de seguir usuários

### Sprint 5 - Métricas e Analytics (Semana 7)
- [ ] Registro de pesos por exercício
- [ ] Histórico de progressão
- [ ] Estatísticas do usuário
- [ ] Gráficos de evolução

### Sprint 6 - Polimento (Semana 8)
- [ ] Documentação Swagger completa
- [ ] Testes de integração
- [ ] Otimizações de performance
- [ ] Deploy e CI/CD

## 📋 Próximos Passos

1. **Configurar Banco de Dados**: Adicionar PostgreSQL e Prisma
2. **Implementar Autenticação**: JWT, bcrypt, guards
3. **Criar Entidades**: User, Profile, Workout, Exercise
4. **Desenvolver Use Cases**: Seguindo princípios da Clean Architecture
5. **Documentar API**: Swagger/OpenAPI
6. **Escrever Testes**: Cobertura mínima de 80%

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

⭐ **Desenvolvido com Clean Architecture + NestJS**
