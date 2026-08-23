# CyberQuest API — Deployment Guide

## Prerequisites

- Docker & Docker Compose (v2+)
- Node.js 20+ (for local development without Docker)
- PostgreSQL 16 (if running outside Docker)

## Quick Start with Docker

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
```

## Environment Variables

See `.env.example` for all required variables. Critical ones:

| Variable | Description |
|---|---|
| `DB_PASSWORD` | PostgreSQL password |
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

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:4000/api-docs
- Health: http://localhost:4000/health
