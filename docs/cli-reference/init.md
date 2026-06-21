# grapity init

Configure the CLI for local or remote Registry mode.

## Usage

```bash
grapity init --local|--remote [options]
```

## Description

`grapity init` writes `~/.grapity/config.yaml`, which tells all other CLI commands where to find the Registry. You only need to run this once per machine.

In **local mode**, the CLI talks to a Registry that you start yourself with `grapity serve`. The config stores the local port and database backend.

In **remote mode**, the CLI talks to a Registry already running at a URL you provide. This can be a self-hosted instance or a managed service.

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--local` | Use local mode | — |
| `--remote` | Use remote mode (connect to a hosted Grapity server) | — |
| `--url <url>` | Registry URL (required for remote mode) | — |
| `--port <port>` | Port for local server | `3750` |
| `--db <path-or-url>` | SQLite path or `postgresql://` URL. Takes precedence over `GRAPITY_DATABASE_URL`. | — |
| `--auth <mode>` | Auth mode: `none` or `keycloak` | `none` |
| `--keycloak-server <url>` | Keycloak base URL, e.g. `https://keycloak.example.com` | — |
| `--keycloak-realm <realm>` | Keycloak realm name | — |
| `--keycloak-client-id <id>` | Keycloak client ID for CLI client credentials (required with `--auth keycloak`) | — |
| `--keycloak-audience <audience>` | Required `aud` claim value for validated tokens | — |
| `--keycloak-role-source <source>` | Where to read roles from: `scope` or `realm_access.roles` | `scope` |

## Examples

### Local mode (SQLite)

```bash
grapity init --local
```

Generated `~/.grapity/config.yaml`:

```yaml
mode: local
local:
  port: 3750
  database: sqlite
  sqlitePath: /Users/you/.grapity/registry.db
```

### Self-hosted with custom port

```bash
grapity init --local --port 8080 --db /data/grapity.db
```

### Local mode with PostgreSQL

```bash
export GRAPITY_DATABASE_URL="postgresql://grapity:grapity@localhost:5433/grapity"
grapity init --local
```

Generated `~/.grapity/config.yaml`:

```yaml
mode: local
local:
  port: 3750
  database: postgresql
  postgresUrl: postgresql://grapity:grapity@localhost:5433/grapity
```

You can also pass the URL directly with `--db`:

```bash
grapity init --local --db postgresql://grapity:grapity@localhost:5433/grapity
```

The database URL is resolved in this order:

1. `--db <path-or-url>` flag
2. `GRAPITY_DATABASE_URL` environment variable
3. Default SQLite database at `~/.grapity/registry.db`

### Remote mode (your own hosted Registry)

```bash
grapity init --remote --url https://registry.example.com
```

Generated `~/.grapity/config.yaml`:

```yaml
mode: remote
remote:
  url: https://registry.example.com
```

### Remote mode with Keycloak

```bash
grapity init --remote --url https://registry.example.com \
  --auth keycloak \
  --keycloak-server https://keycloak.example.com \
  --keycloak-realm grapity \
  --keycloak-client-id grapity-cli \
  --keycloak-audience grapity-cli
```

Generated `~/.grapity/config.yaml`:

```yaml
mode: remote
remote:
  url: https://registry.example.com
  auth:
    mode: keycloak
    serverUrl: https://keycloak.example.com
    realm: grapity
    clientId: grapity-cli
    audience: grapity-cli
```

Set the client secret in the environment, never in the config file:

```bash
export GRAPITY_CLIENT_SECRET="your-client-secret"
```

### Local mode with Keycloak

1. Start a reachable Keycloak server. Download the example Docker Compose stack:

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

   The `-v` flag is required because Keycloak only imports the realm on first startup.

2. In Keycloak, create or import a realm and two clients:
   - A **confidential client** for the CLI (for example `grapity-cli`) with:
     - `client_credentials` grant enabled
     - service account enabled
     - scopes for the operations you need (for example `specs:read`, `specs:write`)
   - A **public client** for the Hub (for example `grapity-hub`) with:
     - Standard flow enabled
     - PKCE method `S256`
     - Valid redirect URIs for the Hub origin (for example `http://localhost:3000/*`)

   The example realm you downloaded defines `grapity-cli`, `grapity-hub`, and a default user `demo` / `demo`.

3. Configure grapity:

   ```bash
   ./grapity/bin/grapity init --local --port 3750 --auth keycloak \
     --keycloak-server http://localhost:8080 \
     --keycloak-realm grapity \
     --keycloak-client-id grapity-cli \
     --keycloak-audience grapity-cli
   ```

4. Set the client secret before running commands:

   ```bash
   export GRAPITY_CLIENT_SECRET="grapity-cli-secret"
   ```

5. Start the Registry:

   ```bash
   ./grapity/bin/grapity serve
   ```

The Hub is also available when Keycloak auth is enabled. Sign in with the Keycloak user you created (or `demo` / `demo` if you used the example realm).

Generated `~/.grapity/config.yaml`:

```yaml
mode: local
local:
  port: 3750
  database: sqlite
  sqlitePath: /Users/you/.grapity/registry.db
  auth:
    mode: keycloak
    serverUrl: http://localhost:8080
    realm: grapity
    clientId: grapity-cli
    audience: grapity-cli
```

## Config file schema

```yaml
mode: local | remote
local:
  port: number
  database: sqlite | postgresql
  sqlitePath: string
  postgresUrl: string
  auth:
    mode: none | keycloak
    serverUrl: string
    realm: string
    clientId: string
    audience: string
    roleSource: scope | realm_access.roles
remote:
  url: string
  auth:
    mode: keycloak
    serverUrl: string
    realm: string
    clientId: string
    audience: string
    roleSource: scope | realm_access.roles
```

The CLI reads this config automatically. You never need to pass `--url` or `--port` to other commands after initialization.

## See also

- [grapity serve](/cli-reference/serve) — Start the local Registry server
- [grapity auth](/cli-reference/auth) — Check authentication status
- [grapity registry](/cli-reference/registry) — Push and manage specs
