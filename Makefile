.DEFAULT_GOAL := help

COMPOSE       := docker-compose
COMPOSE_INFRA := docker-compose -f docker-compose.infrastructure.yml
SERVICE       ?=
NAME          ?=

## ---------------------------------------------------------------------------
## Environment
## ---------------------------------------------------------------------------

.PHONY: env
env: ## Create .env from .env.sample if it doesn't exist yet
	@test -f .env || cp .env.sample .env

## ---------------------------------------------------------------------------
## Quick Start (Production/Testing Mode) - full stack via Docker Compose
## ---------------------------------------------------------------------------

.PHONY: build up start ps logs down down-v restart rebuild
build: ## Build all images in parallel
	$(COMPOSE) build --parallel

up: ## Start all services (detached)
	$(COMPOSE) up -d

start: ## Build and start all services in one command
	$(COMPOSE) up --build -d

ps: ## Show status of all services
	$(COMPOSE) ps

logs: ## Tail logs for all services
	$(COMPOSE) logs -f

logs-%: ## Tail logs for a specific service, e.g. make logs-catalog-api
	$(COMPOSE) logs -f $*

down: ## Stop all services
	$(COMPOSE) down

down-v: ## Stop all services and remove volumes (clean slate)
	$(COMPOSE) down -v

restart: ## Restart all services
	$(COMPOSE) restart

restart-%: ## Restart a specific service, e.g. make restart-catalog-api
	$(COMPOSE) restart $*

rebuild: ## Rebuild and restart all services (force recreate)
	$(COMPOSE) up --build -d --force-recreate

## ---------------------------------------------------------------------------
## Development Mode - infrastructure services only
## ---------------------------------------------------------------------------

.PHONY: infra-up infra-ps infra-logs infra-down infra-down-v
infra-up: ## Start infrastructure services only (databases, broker, monitoring, etc.)
	$(COMPOSE_INFRA) up -d

infra-ps: ## Show status of infrastructure services
	$(COMPOSE_INFRA) ps

infra-logs: ## Tail logs for all infrastructure services
	$(COMPOSE_INFRA) logs -f

infra-logs-%: ## Tail logs for a specific infrastructure service
	$(COMPOSE_INFRA) logs -f $*

infra-down: ## Stop infrastructure services
	$(COMPOSE_INFRA) down

infra-down-v: ## Stop infrastructure services and remove volumes
	$(COMPOSE_INFRA) down -v

infra-restart-%: ## Restart a specific infrastructure service
	$(COMPOSE_INFRA) restart $*

## ---------------------------------------------------------------------------
## Database Migrations
## ---------------------------------------------------------------------------

.PHONY: migrate migration-add ef-add ef-update
migrate: ## Apply all pending migrations for Inventory (MySQL) and Order (SQL Server)
	bash scripts/run-migration.sh

migration-add: ## Interactively create + apply a new migration for a service
	bash scripts/add-migration.sh

ef-add: ## Add an EF migration: make ef-add SERVICE=Catalog NAME=AddSomething
	cd src/Services/$(SERVICE)/Infrastructure && dotnet ef migrations add $(NAME) -s ../Api/$(SERVICE).Api

ef-update: ## Apply EF migrations: make ef-update SERVICE=Catalog
	cd src/Services/$(SERVICE)/Infrastructure && dotnet ef database update -s ../Api/$(SERVICE).Api

## ---------------------------------------------------------------------------
## Building Docker Images
## ---------------------------------------------------------------------------

.PHONY: build-infra-svc build-grpc build-api-svc build-workers build-gateway-apps build-all build-nocache
build-infra-svc: ## Method 1, Step 1: start infrastructure services first
	$(COMPOSE) up -d redis postgres-sql mysql mongodb sql-server elasticsearch rabbitmq minio keycloak otel-collector

build-grpc: ## Method 1, Step 2: build and run gRPC services
	$(COMPOSE) up --build -d catalog-grpc inventory-grpc order-grpc discount-grpc report-grpc

build-api-svc: ## Method 1, Step 3: build and run API services
	$(COMPOSE) up --build -d catalog-api basket-api inventory-api order-api discount-api notification-api search-api report-api communication-api

build-workers: ## Method 1, Step 4: build and run Workers
	$(COMPOSE) up --build -d basket-worker-outbox catalog-woker-outbox catalog-worker-consumer inventory-worker-outbox inventory-worker-consumer order-woker-outbox order-worker-consumer search-worker-consumer notification-worker-consumer notification-worker-processor

build-gateway-apps: ## Method 1, Step 5: build and run API Gateway and Apps
	$(COMPOSE) up --build -d api-gateway app-admin app-store app-job

build-all: ## Method 2: build all images in parallel, then start everything
	$(COMPOSE) build --parallel
	$(COMPOSE) up -d

build-%: ## Method 3: build a specific service, e.g. make build-catalog-api
	$(COMPOSE) build $*

up-%: ## Method 3: build and start a specific service, e.g. make up-catalog-api
	$(COMPOSE) up --build -d $*

build-nocache: ## Force rebuild all images without cache
	$(COMPOSE) build --no-cache --parallel

## ---------------------------------------------------------------------------
## Running Individual Backend Services (dotnet run)
## ---------------------------------------------------------------------------

.PHONY: run-catalog-api run-basket-api run-order-api run-inventory-api run-discount-api \
        run-notification-api run-report-api run-search-api run-communication-api run-api-gateway

run-catalog-api: ## Run Catalog Service API
	cd src/Services/Catalog/Api/Catalog.Api && dotnet run

run-basket-api: ## Run Basket Service API
	cd src/Services/Basket/Api/Basket.Api && dotnet run

run-order-api: ## Run Order Service API
	cd src/Services/Order/Api/Order.Api && dotnet run

run-inventory-api: ## Run Inventory Service API
	cd src/Services/Inventory/Api/Inventory.Api && dotnet run

run-discount-api: ## Run Discount Service API
	cd src/Services/Discount/Api/Discount.Api && dotnet run

run-notification-api: ## Run Notification Service API
	cd src/Services/Notification/Api/Notification.Api && dotnet run

run-report-api: ## Run Report Service API
	cd src/Services/Report/Api/Report.Api && dotnet run

run-search-api: ## Run Search Service API
	cd src/Services/Search/Api/Search.Api && dotnet run

run-communication-api: ## Run Communication Service API
	cd src/Services/Communication/Api/Communication.Api && dotnet run

run-api-gateway: ## Run the YARP API Gateway
	cd src/ApiGateway/YarpApiGateway && dotnet run

## ---------------------------------------------------------------------------
## Running Worker Services (Background Jobs)
## ---------------------------------------------------------------------------

.PHONY: run-catalog-worker run-basket-worker run-order-worker run-inventory-worker \
        run-notification-worker run-search-worker

run-catalog-worker: ## Run Catalog Outbox Worker
	cd src/Services/Catalog/Worker/Catalog.Worker.Outbox && dotnet run

run-basket-worker: ## Run Basket Outbox Worker
	cd src/Services/Basket/Worker/Basket.Worker.Outbox && dotnet run

run-order-worker: ## Run Order Outbox Worker
	cd src/Services/Order/Worker/Order.Worker.Outbox && dotnet run

run-inventory-worker: ## Run Inventory Outbox Worker
	cd src/Services/Inventory/Worker/Inventory.Worker.Outbox && dotnet run

run-notification-worker: ## Run Notification Consumer Worker
	cd src/Services/Notification/Worker/Notification.Worker.Consumer && dotnet run

run-search-worker: ## Run Search Consumer Worker
	cd src/Services/Search/Worker/Search.Worker.Consumer && dotnet run

## ---------------------------------------------------------------------------
## Running Frontend Applications
## ---------------------------------------------------------------------------

.PHONY: run-app-admin run-app-store

run-app-admin: ## Install deps and run App.Admin (http://localhost:3001)
	cd src/Apps/App.Admin && npm install && npm run dev

run-app-store: ## Install deps and run App.Store (http://localhost:3002)
	cd src/Apps/App.Store && npm install && npm run dev

## ---------------------------------------------------------------------------
## Job Orchestrator
## ---------------------------------------------------------------------------

.PHONY: run-job-orchestrator
run-job-orchestrator: ## Run the scheduled Job Orchestrator
	cd src/JobOrchestrator/App.Job && dotnet run

## ---------------------------------------------------------------------------
## Development helpers
## ---------------------------------------------------------------------------

.PHONY: watch test test-svc
watch: ## Run a service with hot reload: make watch SERVICE=Catalog
	cd src/Services/$(SERVICE)/Api/$(SERVICE).Api && dotnet watch run

test: ## Run all tests
	dotnet test

test-svc: ## Run tests for a specific service: make test-svc SERVICE=Catalog
	cd src/Services/$(SERVICE)/Tests && dotnet test

## ---------------------------------------------------------------------------
## Docker Maintenance
## ---------------------------------------------------------------------------

.PHONY: prune prune-all stats df
prune: ## Remove stopped containers and unused images
	docker system prune -f

prune-all: ## Remove all unused images, containers, networks, and volumes
	docker system prune -af --volumes

stats: ## Show live container resource usage
	docker stats

df: ## Show Docker disk usage
	docker system df

## ---------------------------------------------------------------------------
## Help
## ---------------------------------------------------------------------------

.PHONY: help
help: ## Show this help
	@grep -E '^[a-zA-Z0-9_.%-]+:.*?## ' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-24s\033[0m %s\n", $$1, $$2}'
