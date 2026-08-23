# CyberQuest API — Deployment Guide

## Prerequisites

- Docker & Docker Compose (v2+) — for local development
- Node.js 20+ — for local development without Docker
- PostgreSQL 16 or Supabase account — for the database

## Database Setup

### Option A: Supabase (Recommended for Production)

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Project Settings → Database → Connection string**
3. Copy the **URI** connection string (looks like `postgresql://postgres:[password]@[host]:5432/postgres`)
4. Set in `.env`:
   ```
   PRIMARY_DB=supabase
   SUPABASE_DB_URL=postgresql://postgres:[password]@[host]:5432/postgres
   ```
5. Run migrations against Supabase:
   ```bash
   pnpm run migrate
   ```
6. Seed data:
   ```bash
   pnpm run migrate:seed
   ```

### Option B: Local PostgreSQL

1. Install PostgreSQL 16
2. Create a database named `cyberquest_db`
3. Set in `.env`:
   ```
   PRIMARY_DB=local
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=cyberquest_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```
4. Run migrations:
   ```bash
   pnpm run migrate
   ```
5. Seed data:
   ```bash
   pnpm run migrate:seed
   ```

## Quick Start with Docker (Local)

1. **Clone and configure:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

2. **Start everything:**
   ```bash
   docker compose up -d
   ```

3. **Verify:**
   ```bash
   curl http://localhost:4000/health
   # Expected: {"success":true,"message":"CyberQuest API is up"}
   ```

4. **Seed admin user:**
   ```bash
   docker compose exec api pnpm run seed:admin
   ```

## Useful Commands

```bash
make build      # Build Docker images
make start      # Start API + Postgres
make stop       # Stop containers
make restart    # Restart API
make logs       # Tail API logs
make clean      # Stop and delete volumes (WARNING: data loss)
make seed-admin # Seed default admin user
pnpm run migrate        # Run pending DB migrations
pnpm run migrate:seed   # Run migrations + seed data
```

## Environment Variables

See `.env.example` for all required variables. Critical ones:

| Variable | Description |
|---|---|
| `PRIMARY_DB` | `local` or `supabase` |
| `SUPABASE_DB_URL` | Full Supabase Postgres connection URI (when `PRIMARY_DB=supabase`) |
| `DB_PASSWORD` | PostgreSQL password (when `PRIMARY_DB=local`) |
| `JWT_SECRET` | Secret for JWT signing (use a strong random string) |
| `ADMIN_EMAIL` | Default admin email |
| `ADMIN_PASSWORD` | Default admin password |
| `CLIENT_URL` | Frontend URL for CORS |

## Production Deployment

### Option A: Docker Compose (VPS / Single Server)

```bash
# On your server
git clone <your-repo-url>
cd cyberquest_api
cp .env.example .env
# Edit .env with production values
docker compose up -d
```

### Option B: Manual Deployment

```bash
# Build
pnpm install --frozen-lockfile
pnpm run build

# Run
NODE_ENV=production node dist/index.js
```

## Supabase-Specific Notes

- All table and column names use **snake_case** in the database
- Sequelize models use camelCase in JavaScript, mapped via `field` property
- Migrations are plain SQL files in `src/db/migrations/`
- Run `pnpm run migrate` to apply migrations to Supabase
- The `logs/` directory is gitignored; Winston writes `error.log` and `combined.log` in production

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:4000/api-docs
- Health: http://localhost:4000/health
