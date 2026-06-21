# grapity serve

Start the local Grapity Registry server and optionally the Hub developer portal.

## Usage

```bash
grapity serve [options]
```

## Description

`grapity serve` starts the Registry HTTP server on the configured port. By default, it also starts the Hub developer portal on a separate port.

All connection configuration (database, Keycloak) is read from `~/.grapity/config.yaml`, which is created by `grapity init`. Use `GRAPITY_DATABASE_URL` to keep database credentials out of the config file.

Running `grapity serve` with no flags starts:

- **Registry** on port `3750`
- **Hub** on port `3000`
- **Database**: SQLite at `~/.grapity/registry.db`
- **Auth**: enabled if configured in `~/.grapity/config.yaml`; otherwise the command fails unless you pass `--no-auth`

`grapity serve` requires a config file. Run `grapity init` first. It is for local mode only and refuses to start when `mode: remote`.

::: warning
`--no-auth` disables authentication entirely. It is intended only for local development. Do not use it in production or on any shared network.
:::

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `-p, --port <port>` | Port for the Registry server | `3750` |
| `--hub-port <port>` | Port for the Hub developer portal | `3000` |
| `--no-hub` | Skip starting the developer portal | (starts hub) |
| `--no-auth` | Start without authentication | (uses auth config) |

## External dependencies

Depending on your config, `grapity serve` expects other services to be reachable.

| Feature | Required service | Example file |
|---------|------------------|--------------|
| Auth | A reachable Keycloak server matching `serverUrl` and `realm` | [`docker-compose.keycloak.yml`](/examples/docker-compose.keycloak.yml) |
| Gateway provisioning | A reachable Kong Admin API and the `deck` binary | [`docker-compose.kong.yml`](/examples/docker-compose.kong.yml) |
| PostgreSQL | A reachable PostgreSQL server | [`docker-compose.grapity-db.yml`](/examples/docker-compose.grapity-db.yml) |

`grapity serve` itself only starts the Registry and Hub. It does not start Keycloak, Kong, or PostgreSQL for you. Download the example files from [Examples](/examples/).

## Examples

### Default local mode without Keycloak

```bash
grapity serve --no-auth
```

Output:

```text
  ◆  grapity  ·  v0.3.0

  ◆  grapity Registry
  ·  Port: 3750
  ·  Database: sqlite
  ·  Path: /Users/.../.grapity/registry.db
  ·  Auth: none

  ●  Server ready  ·  http://localhost:3750
```

### Default local mode with Keycloak auth

Start the local Keycloak stack first:

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

Then configure and start grapity:

```bash
grapity init --local --auth keycloak \
  --keycloak-server http://localhost:8080 \
  --keycloak-realm grapity \
  --keycloak-client-id grapity-cli \
  --keycloak-audience grapity-cli

grapity serve
```

Output:

```text
  ◆  grapity  ·  v0.3.0

  ◆  grapity Registry
  ·  Port: 3750
  ·  Database: sqlite
  ·  Path: /Users/.../.grapity/registry.db
  ·  Auth: keycloak

  ●  Server ready  ·  http://localhost:3750
```

### Registry only

```bash
grapity serve --no-hub
```

## Graceful shutdown

Press `Ctrl+C` to stop both servers cleanly.

## See also

- [grapity init](/cli-reference/init) — Configure the CLI
- [grapity registry](/cli-reference/registry) — Push specs to the running server
- [grapity auth](/cli-reference/auth) — Check authentication status
