COMPOSE ?= docker compose
FRONTEND ?= $(COMPOSE) exec -T frontend
NPM ?= npm --prefix frontend

.DEFAULT_GOAL := help

help: ## Show available targets
	@awk 'BEGIN {FS = ":.*##"; printf "\nSaaS-UI\n\n"} /^[a-zA-Z0-9_-]+:.*##/ {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@printf "\n"

install: ## Install frontend dependencies
	$(NPM) install

dev: ## Start the Vite dev server locally
	$(NPM) run dev

build: ## Type-check and build the local editor
	$(NPM) run build

preview: ## Preview the production build
	$(NPM) run preview

up: ## Build and start the frontend container
	$(COMPOSE) up -d --build

down: ## Stop containers
	$(COMPOSE) down

logs: ## Follow container logs
	$(COMPOSE) logs -f

ps: ## Container status
	$(COMPOSE) ps

frontend-shell: ## Open a shell in the frontend container
	$(FRONTEND) sh

test: ## Run frontend tests
	$(NPM) run test -- --run

lint: ## Lint the frontend
	$(NPM) run lint

lint-fix: ## Auto-fix frontend lint issues
	$(NPM) run lint -- --fix

typecheck: ## Type-check the frontend
	$(NPM) run typecheck

.PHONY: help install dev build preview up down logs ps frontend-shell test lint lint-fix typecheck
