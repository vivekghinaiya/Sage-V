.PHONY: lint format typecheck build test clean

# --- Linting ---
lint: lint-server lint-client

lint-server:
	cd server && ruff check . || true

lint-client:
	cd client && yarn lint

# --- Formatting ---
format: format-server format-client

format-server:
	cd server && ruff format .

format-client:
	cd client && npx prettier --write .

# --- Type checking ---
typecheck: typecheck-server typecheck-client

typecheck-server:
	cd server && python -m mypy --ignore-missing-imports . || true

typecheck-client:
	cd client && yarn tsc --noEmit

# --- Build ---
build: build-client

build-client:
	cd client && yarn build

build-server:
	docker build -f server/Dockerfile -t sage-v-server server/

build-docker: build-server
	docker build -f client/Dockerfile -t sage-v-client client/

# --- Tests ---
test: test-client

test-server:
	cd server && python -m pytest . -v --cov=. --cov-report=term-missing || true

test-client:
	cd client && yarn test --run

test-coverage:
	cd client && yarn test:coverage

# --- Clean ---
clean:
	cd client && rm -rf .next out node_modules/.cache
