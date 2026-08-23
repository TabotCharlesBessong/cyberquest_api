#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Deploying CyberQuest API..."

# Check for .env file
if [ ! -f .env ]; then
  echo "❌ Error: .env file not found. Copy .env.example to .env and fill in your values."
  exit 1
fi

# Build and start
echo "📦 Building Docker images..."
docker compose build

echo "🗄️  Starting database and API..."
docker compose up -d

echo "⏳ Waiting for API to be healthy..."
sleep 10

# Check health
if curl -sf http://localhost:4000/health > /dev/null; then
  echo "✅ API is healthy at http://localhost:4000"
else
  echo "⚠️  API health check failed. Check logs with: docker compose logs api"
fi

echo ""
echo "📋 Useful commands:"
echo "  docker compose logs -f api    # View API logs"
echo "  docker compose logs -f postgres  # View DB logs"
echo "  docker compose down           # Stop everything"
echo "  docker compose down -v        # Stop and delete volumes (WARNING: data loss)"
