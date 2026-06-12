# grapity init

Configure the CLI for local or remote registry mode.

## Usage

```bash
grapity init --local|--remote [options]
```

## Description

`grapity init` writes `~/.grapity/config.yaml`, which tells all other CLI commands where to find the Registry. You only need to run this once per machine.

## Options

| Option | Description |
|--------|-------------|
| `--local` | Use local mode (SQLite database on this machine) |
| `--remote` | Use remote mode (connect to a hosted Grapity server) |
| `--url <url>` | Registry URL (required for remote mode) |
| `--port <port>` | Port for local server (default: `3750`) |
| `--db <path>` | Path to SQLite database file (for local mode; default: `~/.grapity/registry.db`) |

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
  sqlitePath: /Users/you/.grapity/registry.db
```

### Self-hosted with custom port

```bash
grapity init --local --port 8080 --db /data/grapity.db
```

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
  sqlitePath: string
remote:
  url: string
```

::: tip
The CLI reads this config automatically. You never need to pass `--url` or `--port` to other commands after initialization.
:::

## See also

- [grapity serve](/cli-reference/serve) — Start the local Registry server
- [grapity registry](/cli-reference/registry) — Push and manage specs
