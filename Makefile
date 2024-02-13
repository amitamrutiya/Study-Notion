.PHONY: start-server start-client

start-server:
	@cd backend && npm run dev

start-client:
	@cd frontend && npm run dev

dev:
	@make start-server & make start-client

lint-server:
	@cd backend && npm run format

lint-client:
	@cd frontend && npm run format

lint:
	@make format-server & make format-client

test-server:
	@cd backend && npm run test

test-client:
	@cd frontend && npm run test

test:
	@make test-server & make test-client

format-server:
	@cd backend && npx eslint . --fix

format-client:
	@cd frontend && npx eslint . --fix

format:
	@make format-server & make format-client

build:
	@cd frontend && npm run build
