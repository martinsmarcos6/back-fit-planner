# 🐳 Configuração Docker

## Banco de Dados PostgreSQL

### Configuração do .env

Crie um arquivo `.env` na raiz do projeto com:

```env
# DATABASE (Docker)
DATABASE_URL="postgresql://fitplanner:fitplanner123@localhost:5432/back_fit_planner?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# SERVER
PORT=3000
```

### Scripts Docker

```bash
# Iniciar banco de dados
pnpm docker:up

# Parar banco de dados
pnpm docker:down

# Ver logs do banco
pnpm docker:logs

# Resetar banco (apaga todos os dados)
pnpm docker:reset
```

### Scripts Prisma

```bash
# Executar migrations
pnpm db:migrate

# Gerar cliente Prisma
pnpm db:generate

# Abrir Prisma Studio (interface visual)
pnpm db:studio

# Resetar banco e rodar migrations
pnpm db:reset
```

### Acesso ao Banco

- **PostgreSQL**: `localhost:5432`
- **Adminer** (interface web): `http://localhost:8080`
  - Sistema: PostgreSQL
  - Servidor: postgres
  - Usuário: fitplanner
  - Senha: fitplanner123
  - Base de dados: back_fit_planner