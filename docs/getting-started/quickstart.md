# Quickstart

Get Grapity running in under five minutes.

## What you will do

1. Install the Grapity CLI
2. Initialize local configuration
3. Start the Registry and Hub
4. Push your first API spec
5. Browse it in the Hub
6. Push a gateway config
7. Preview decK YAML
8. Provision to a local Kong and query logs (Optional)

## Prerequisites

- **Node.js** 20+ or **Bun** 1.3.5+
- One OpenAPI spec file (or use the example below)

## 1. Install the CLI

::: code-group

```bash [npm]
npm install -g @grapity/grapity
```

```bash [bun]
bun add -g @grapity/grapity
```

:::

## 2. Initialize local mode

```bash
grapity init --local
```

This creates `~/.grapity/config.yaml` with default settings:

```yaml
mode: local
local:
  port: 3750
  sqlitePath: ~/.grapity/registry.db
```

## 3. Start both servers

```bash
grapity serve
```

You will see:

```text
● Registry ready  ·  http://localhost:3750
● Hub ready     ·  http://localhost:3000
```

The Registry stores and validates specs. The Hub is the developer portal.

## 4. Push your first spec

Create a minimal OpenAPI file named `openapi.yaml`:

```yaml
openapi: "3.1.0"
info:
  title: Payments API
  version: "1.0.0"
paths:
  /v1/payments:
    get:
      summary: List payments
      responses:
        "200":
          description: OK
```

Then push it:

```bash
grapity registry push ./openapi.yaml --name payments-api
```

You will see:

```text
✓ Spec validated
✓ Backward compatibility: 0 breaking, 0 safe changes
✓ Version 1.0.0 registered
```

## 5. Browse the Hub

Open http://localhost:3000 in your browser.

You will see `payments-api` in the spec list. Click it to explore endpoints, view the compatibility report, and compare versions.

## 6. Push a gateway config

Create a gateway config named `gateway.config.yaml` that references the spec you just pushed:

```yaml
apiVersion: v1
kind: GatewayConfig

spec:
  name: payments-gateway
  provider: kong
  specName: payments-api
  specSemver: "1.0.0"

routes:
  - path: /v1/payments
    methods: [GET]

environments:
  staging:
    kongAddr: http://localhost:8001
    upstream: http://localhost:8080
    plugins:
      - name: http-log
        config:
          http_endpoint: "http://host.docker.internal:3750/v1/gateway-logs/ingest/kong/staging"
          method: POST
          content_type: application/json
          timeout: 10000
          keepalive: 60000
```

Then push it:

```bash
grapity gateway push ./gateway.config.yaml
```

You will see:

```text
  ✓ payments-gateway pushed
  ◆ Version <uuid>
```

The registry validates every route against the spec. If a route does not exist in the spec, the push is blocked.

## 7. Preview decK YAML

See what would be sent to Kong, without any external dependencies:

```bash
grapity gateway preview --name payments-gateway --env staging
```

This renders decK-compatible YAML to stdout. Use `--output deck.yaml` to write to a file.

## 8. Provision to a local Kong (Optional, 10 min)

This step requires Docker. It completes the full loop: spec → gateway → Kong → traffic → logs.

### Start Kong locally

Create a `docker-compose.yml` file in your working directory:

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: kong
      POSTGRES_USER: kong
      POSTGRES_PASSWORD: kong
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "kong"]
      interval: 5s
      timeout: 5s
      retries: 5

  kong-migrations:
    image: kong:3.9
    environment:
      KONG_DATABASE: postgres
      KONG_PG_HOST: postgres
      KONG_PG_DATABASE: kong
      KONG_PG_USER: kong
      KONG_PG_PASSWORD: kong
    command: kong migrations bootstrap
    depends_on:
      postgres:
        condition: service_healthy

  kong:
    image: kong:3.9
    environment:
      KONG_DATABASE: postgres
      KONG_PG_HOST: postgres
      KONG_PG_DATABASE: kong
      KONG_PG_USER: kong
      KONG_PG_PASSWORD: kong
      KONG_PROXY_ACCESS_LOG: /dev/stdout
      KONG_ADMIN_ACCESS_LOG: /dev/stdout
      KONG_PROXY_ERROR_LOG: /dev/stderr
      KONG_ADMIN_ERROR_LOG: /dev/stderr
      KONG_ADMIN_LISTEN: 0.0.0.0:8001
    ports:
      - "8000:8000"
      - "8001:8001"
    depends_on:
      kong-migrations:
        condition: service_completed_successfully

  httpbin:
    image: mccutchen/go-httpbin
    ports:
      - "8080:8080"

volumes:
  postgres_data:
```

Start the stack:

```bash
docker compose up -d
```

This starts:
- Kong Proxy on `http://localhost:8000`
- Kong Admin API on `http://localhost:8001` (used by decK)
- httpbin upstream on `http://localhost:8080`
- PostgreSQL for Kong state persistence

### Install decK

Follow the [official decK installation guide](https://developer.konghq.com/deck/#install-deck) for your platform.

### Run deck diff (safe, no changes)

```bash
grapity gateway provision --name payments-gateway --env staging
```

You will see:

```text
  Running deck gateway diff against http://localhost:8001…
  Diff computed for payments-gateway → staging
```

### Apply to Kong

```bash
grapity gateway provision --name payments-gateway --env staging --sync
```

You will see:

```text
  Running deck gateway sync against http://localhost:8001…
  ✓ Applied for payments-gateway → staging
```

### Generate traffic

```bash
curl http://localhost:8000/v1/payments
```

Kong proxies this to the upstream, and the `http-log` plugin POSTs the access log to the registry.

### Query gateway logs

```bash
grapity gateway logs payments-gateway --env staging
```

You will see:

```text
Gateway logs for payments-gateway
----------------------------------------------------------------------------------------------------
GET    /v1/payments                             status:200  anonymous          <timestamp>
```

### View stats

```bash
grapity gateway logs payments-gateway --env staging --stats
```

You will see:

```text
Endpoint usage for payments-gateway
--------------------------------------------------------------------------------
GET    /v1/payments                             1 calls    0 unique callers  last: <timestamp>
```

When done, tear down:

```bash
docker compose down
```

## Next steps

- [Installation options](/getting-started/installation) — Docker, PostgreSQL, and remote mode
- [Backward Compatibility](/platform/architecture/backward-compatibility) — Learn what changes are blocked and why
- [CLI Reference](/cli-reference/init) — Explore all commands
