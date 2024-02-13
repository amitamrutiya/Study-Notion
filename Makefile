.PHONY: start-server start-client dev lint-server lint-client lint test-server test-client test format-server format-client format build

define run_in_dir
	@(cd $(1) && $(2))
endef

start-server:
	$(call run_in_dir,backend,npm run dev)

start-client:
	$(call run_in_dir,frontend,npm run dev)

dev: start-server start-client

lint-server:
	$(call run_in_dir,backend,npm run format)

lint-client:
	$(call run_in_dir,frontend,npm run format)

lint: lint-server lint-client

test-server:
	$(call run_in_dir,backend,npm run test)

test-client:
	$(call run_in_dir,frontend,npm run test)

test: test-server test-client

format-server:
	$(call run_in_dir,backend,npx eslint . --fix)

format-client:
	$(call run_in_dir,frontend,npx eslint . --fix)

format: format-server format-client

build:
	$(call run_in_dir,frontend,npm run build)