.PHONY: help build start stop restart logs clean seed-admin

help:
	@echo "CyberQuest API - Deployment Commands"
	@echo "  make build       - Build Docker images"
	@echo "  make start       - Start API + Postgres"
	@echo "  make stop        - Stop containers"
	@echo "  make restart     - Restart API"
	@echo "  make logs        - Tail API logs"
	@echo "  make clean       - Stop and remove volumes (WARNING: data loss)"
	@echo "  make seed-admin  - Seed default admin user"

build:
	docker compose build

start:
	docker compose up -d
	@echo "Waiting for API..."
	@sleep 10
	@curl -sf http://localhost:4000/health && echo "✅ API healthy" || echo "⚠️  API not ready yet"

stop:
	docker compose down

restart: stop start

logs:
	docker compose logs -f api

clean:
	docker compose down -v

seed-admin:
	docker compose exec api pnpm run seed:admin
