# grapity serve

Start the local Grapity Registry server and optionally the Hub developer portal.

## Usage

```bash
grapity serve [options]
```

## Description

`grapity serve` starts the Registry HTTP server on the configured port. By default, it also starts the Hub developer portal on a separate port.

Requires `@grapity/registry` to be installed (peer dependency).

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `-p, --port <port>` | Port for the Registry server | `3750` |
| `--db <url>` | Database URL. SQLite path or `postgresql://` URL | `~/.grapity/registry.db` |
| `--auth <mode>` | Auth mode: `none`, `api-key`, `jwt` | `none` |
| `--hub-port <port>` | Port for the Hub developer portal | `3000` |
| `--no-hub` | Skip starting the developer portal | (starts hub) |

## Examples

### Default local mode

```bash
grapity serve
```

Output:

```text
Registry ready  ·  http://localhost:3750
Hub ready       ·  http://localhost:3000
```

### With PostgreSQL

```bash
grapity serve --db postgresql://user:pass@localhost:5432/grapity --auth jwt
```

### Custom Hub port

```bash
grapity serve --hub-port 8080
```

### Registry only, no Hub

```bash
grapity serve --no-hub
```

### Custom grace period

```bash
grapity serve --grace-period-days 90
```

## Database backends

The CLI auto-detects the database backend from the `--db` value:

- Starts with `postgresql://` → PostgreSQL
- Anything else (or omitted) → SQLite

## Auth modes

| Mode | Use case |
|------|----------|
| `none` | Local development (default) |
| `api-key` | Self-hosted with shared API keys |
| `jwt` | Production with identity provider |

## Graceful shutdown

Press `Ctrl+C` to stop both servers cleanly.

## See also

- [grapity init](/cli-reference/init) — Configure the CLI
- [grapity registry](/cli-reference/registry) — Push specs to the running server
