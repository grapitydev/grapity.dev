# grapity serve

Start the local Grapity Registry server and optionally the Hub developer portal.

## Usage

```bash
grapity serve [options]
```

## Description

`grapity serve` starts the Registry HTTP server on the configured port. By default, it also starts the Hub developer portal on a separate port.

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `-p, --port <port>` | Port for the Registry server | `3750` |
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
