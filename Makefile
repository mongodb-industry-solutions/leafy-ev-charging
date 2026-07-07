COMPOSE := COMPOSE_PROFILES=local docker compose
COMPOSE_ATLAS := docker compose
ATLAS_SERVICES := frontend backend simulator
LOCAL_DOCKER_MONGODB_URI := mongodb://mongodb:27017/?replicaSet=rs0&directConnection=true
SIMULATOR_IMAGE := ev-demo-simulator
SIMULATOR_CONTAINER := ev-demo-simulator
COMPOSE_PROJECT_NETWORK := $(notdir $(CURDIR))_default

.PHONY: build start stop clean cleandb startdb build-atlas start-atlas stop-atlas clean-atlas start-simulator stop-simulator preview-ghpages

build:
	MONGODB_URI=$(LOCAL_DOCKER_MONGODB_URI) $(COMPOSE) up --build -d

start:
	MONGODB_URI=$(LOCAL_DOCKER_MONGODB_URI) $(COMPOSE) up -d

stop:
	$(COMPOSE) stop

clean:
	$(COMPOSE) down --remove-orphans

# Removes named volumes (wipes MongoDB data).
cleandb:
	$(COMPOSE) down --volumes --remove-orphans

startdb: 
	$(COMPOSE) up -d mongodb

build-atlas:
	$(COMPOSE_ATLAS) up --build -d $(ATLAS_SERVICES)

start-atlas:
	$(COMPOSE_ATLAS) up -d $(ATLAS_SERVICES)

stop-atlas:
	$(COMPOSE_ATLAS) stop $(ATLAS_SERVICES)

clean-atlas:
	$(COMPOSE_ATLAS) rm -f -s $(ATLAS_SERVICES)

# Run only the simulator in Docker while frontend/backend run via `npm run dev`.
# Uses MONGODB_URI from .env (Atlas). For local MongoDB, run `make startdb` first and
# pass MONGODB_URI=$(LOCAL_DOCKER_MONGODB_URI) on the command line.
start-simulator:
	docker build -t $(SIMULATOR_IMAGE) ./simulator
	-docker rm -f $(SIMULATOR_CONTAINER) 2>/dev/null
	@set -a; [ -f .env ] && . ./.env; \
	[ -n "$(MONGODB_URI)" ] && export MONGODB_URI="$(MONGODB_URI)"; \
	set +a; \
	network_args=""; \
	if docker network inspect $(COMPOSE_PROJECT_NETWORK) >/dev/null 2>&1; then \
	  network_args="--network $(COMPOSE_PROJECT_NETWORK)"; \
	fi; \
	docker run -d --name $(SIMULATOR_CONTAINER) --rm \
	  $$network_args \
	  -p 8000:8000 \
	  -e MONGODB_URI \
	  -e MONGODB_DATABASE \
	  -e SESSION_TELEMETRY_INTERVAL_SECONDS \
	  -e CHANGE_STREAM_RETRY_SECONDS \
	  -e SIMULATOR_URL \
	  $(SIMULATOR_IMAGE)

stop-simulator:
	-docker stop $(SIMULATOR_CONTAINER)

GHPAGES_PAGES := frontend/app/layout.tsx \
	frontend/app/\(home\)/page.tsx \
	frontend/app/\(admin\)/dashboard/page.tsx \
	frontend/app/\(driver\)/map/page.tsx \
	frontend/app/\(driver\)/sessions/page.tsx

preview-ghpages:
	cp frontend/app/layout.ghpages.tsx frontend/app/layout.tsx
	printf '%s\n' 'export default function Page() { return null; }' \
	  | tee frontend/app/\(home\)/page.tsx \
	        frontend/app/\(admin\)/dashboard/page.tsx \
	        frontend/app/\(driver\)/map/page.tsx \
	        frontend/app/\(driver\)/sessions/page.tsx > /dev/null
	(cd frontend && GITHUB_PAGES_PREVIEW=true NEXT_PUBLIC_GITHUB_PAGES=true npm run build) \
	  || (git checkout $(GHPAGES_PAGES) && exit 1)
	git checkout $(GHPAGES_PAGES)
	rm -rf frontend/out/map frontend/out/sessions frontend/out/dashboard
	printf '<!doctype html><html><head><meta charset="utf-8"/><meta http-equiv="refresh" content="0;url=data-model/"/></head><body></body></html>\n' \
	  > frontend/out/index.html
	@echo "Preview at http://localhost:3001/data-model/"
	npx --yes serve frontend/out -l 3001
