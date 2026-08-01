# Examples

These example files are referenced by the CLI documentation. Download them and adapt them to your environment.

## GitHub Actions workflows

Ready-to-copy CI workflows live in the grapity repository, each with a commented setup header listing the variables and secrets to configure:

| Directory | Purpose |
|-----------|---------|
| [`examples/producer/`](https://github.com/grapitydev/grapity/tree/main/examples/producer) | Validate the spec on pull requests, push new versions on merge |
| [`examples/consumer/`](https://github.com/grapitydev/grapity/tree/main/examples/consumer) | Report spec drift on pull requests as a sticky PR comment |

## Docker Compose stacks

| File | Purpose | Docs |
|------|---------|------|
| [docker-compose.keycloak.yml](/examples/docker-compose.keycloak.yml) | Keycloak + PostgreSQL for local auth | [grapity init](/cli-reference/init#local-mode-with-keycloak) |
| [docker-compose.kong.yml](/examples/docker-compose.kong.yml) | Kong + PostgreSQL + httpbin for gateway provisioning | [Quickstart](/getting-started/quickstart#start-kong-locally) |
| [docker-compose.grapity-db.yml](/examples/docker-compose.grapity-db.yml) | PostgreSQL for the Registry backend | [grapity init](/cli-reference/init#local-mode-with-postgresql) |

## Keycloak realm

| File | Purpose |
|------|---------|
| [keycloak/realm-export.json](/examples/keycloak/realm-export.json) | Example realm with `grapity-cli` and `grapity-hub` clients and a `demo` / `demo` user |

## Quick start

Download the Keycloak stack and realm, then start Keycloak:

```bash
mkdir -p grapity-examples/keycloak
curl -L https://grapity.dev/docs/examples/docker-compose.keycloak.yml \
  -o grapity-examples/docker-compose.keycloak.yml
curl -L https://grapity.dev/docs/examples/keycloak/realm-export.json \
  -o grapity-examples/keycloak/realm-export.json
cd grapity-examples
docker compose -f docker-compose.keycloak.yml down -v
docker compose -f docker-compose.keycloak.yml up -d
```

Keycloak imports the realm only on first startup, so use `down -v` whenever you update `realm-export.json`.

::: tip
These files are copies of the internal development stack. If you are working inside the Grapity repository itself, you may prefer the versions under `docs/local-test/`.
:::
