# grapity serve

Start the local Grapity Registry server and optionally the Hub developer portal.

## Usage

```bash
grapity serve [options]
```

## Description

`grapity serve` starts the Registry HTTP server on the configured port. By default, it also starts the Hub developer portal on a separate port.

The database is determined in this order:

1. `--db` command-line flag
2. `GRAPITY_DATABASE_URL` environment variable
3. `database` setting in `~/.grapity/config.yaml`
4. Default SQLite database at `~/.grapity/registry.db`

Both `grapity init` and `grapity serve` read `GRAPITY_DATABASE_URL`. Use it to keep credentials out of `config.yaml`.

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `-p, --port <port>` | Port for the Registry server | `3750` |
| `--hub-port <port>` | Port for the Hub developer portal | `3000` |
| `--no-hub` | Skip starting the developer portal | (starts hub) |
| `--db <path-or-url>` | SQLite path or `postgresql://` URL | (from config or env) |

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

### SQLite with custom path

```bash
grapity init --local --db /data/grapity.db
grapity serve
```

### PostgreSQL via environment variable

```bash
export GRAPITY_DATABASE_URL="postgresql://user:password@db.example.com:5432/grapity"
grapity init --local
grapity serve
```

### PostgreSQL via command-line flag

```bash
grapity serve --db postgresql://user:password@db.example.com:5432/grapity
```

### Custom Hub port

```bash
grapity serve --hub-port 8080
```

### Registry only, no Hub

```bash
grapity serve --no-hub
```

## Graceful shutdown

Press `Ctrl+C` to stop both servers cleanly.

## See also

- [grapity init](/cli-reference/init) — Configure the CLI
- [grapity registry](/cli-reference/registry) — Push specs to the running server
