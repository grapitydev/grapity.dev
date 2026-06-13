# grapity init

Configure the CLI for local or remote registry mode.

## Usage

```bash
grapity init --local|--remote [options]
```

## Description

`grapity init` writes `~/.grapity/config.yaml`, which tells all other CLI commands where to find the Registry. You only need to run this once per machine.

For local mode, you can choose SQLite (default) or PostgreSQL. Credentials for PostgreSQL can be passed directly via `--db` or, for production, via the `GRAPITY_DATABASE_URL` environment variable.

## Options

| Option | Description |
|--------|-------------|
| `--local` | Use local mode |
| `--remote` | Use remote mode (connect to a hosted Grapity server) |
| `--url <url>` | Registry URL (required for remote mode) |
| `--port <port>` | Port for local server (default: `3750`) |
| `--db <path-or-url>` | SQLite path or `postgresql://` URL. Takes precedence over `GRAPITY_DATABASE_URL`. |

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

### Remote mode (SaaS)

```bash
grapity init --remote --url https://api.grapity.dev
```

Generated `~/.grapity/config.yaml`:

```yaml
mode: remote
remote:
  url: https://api.grapity.dev
```

## Config file schema

```yaml
mode: local | remote
local:
  port: number
  database: sqlite | postgresql
  sqlitePath: string
  postgresUrl: string
remote:
  url: string
```

::: tip
The CLI reads this config automatically. You never need to pass `--url` or `--port` to other commands after initialization.
:::

## See also

- [grapity serve](/cli-reference/serve) — Start the local Registry server
- [grapity registry](/cli-reference/registry) — Push and manage specs
