# grapity gateway

Manage gateway configs and query gateway logs.

## grapity gateway list

List all gateway configs stored in the registry.

```bash
grapity gateway list
```

## grapity gateway push

Push a gateway config file to the registry.

```bash
grapity gateway push <config-file> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--pushed-by <by>` | Pusher identity (user or CI) |

Validates declared routes against the registered spec and stores the config in the registry. If a route does not exist in the linked spec, the push is blocked.

## grapity gateway get

Show details for a gateway config.

```bash
grapity gateway get <name> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--version <uuid>` | Specific version UUID (defaults to latest) |

## grapity gateway versions

List all versions for a gateway config.

```bash
grapity gateway versions <name>
```

## grapity gateway config

Fetch the raw gateway config YAML from the registry.

```bash
grapity gateway config <name> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--version <uuid>` | Specific version UUID (defaults to latest) |
| `--output <file>` | Write output to a file instead of stdout |

## grapity gateway preview

Render decK YAML from a gateway config without running decK.

```bash
grapity gateway preview [file] [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--env <name>` | **Required.** Target environment name |
| `--name <name>` | Gateway config name (registry mode) |
| `--version <uuid>` | Specific version UUID (registry mode, defaults to latest) |
| `--output <file>` | Write decK YAML to a file instead of stdout |

### Examples

```bash
# From a local file
grapity gateway preview ./payments-gateway.config.yaml --env staging

# From the registry
grapity gateway preview --name payments-gateway --env staging
```

## grapity gateway provision

Provision a gateway config to Kong via decK.

```bash
grapity gateway provision --name <name> --env <env> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--name <name>` | **Required.** Gateway config name |
| `--env <name>` | **Required.** Target environment name |
| `--version <uuid>` | Specific config version (defaults to latest) |
| `--sync` | Apply changes via `deck sync` (default is `deck diff`) |

Fetches the latest version from the registry, generates decK YAML, and runs `deck gateway diff` against the environment's Kong admin API.

## grapity gateway logs

Query gateway logs stored in the registry.

```bash
grapity gateway logs <config-name> [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--stats` | Show aggregate statistics instead of individual logs |
| `--env` | Filter by environment (e.g., `staging`, `prod`) |
| `--path` | Filter by request path |
| `--method` | Filter by HTTP method |
| `--status` | Filter by response status code |
| `--from` | Start timestamp (ISO 8601) |
| `--to` | End timestamp (ISO 8601) |
| `--limit` | Maximum number of results (default: 20) |
| `--offset` | Result offset for pagination |

### Examples

```bash
# List recent logs for the payments gateway
grapity gateway logs payments-gateway

# Show stats for production traffic in the last hour
grapity gateway logs payments-gateway --stats --env prod --from "2026-06-01T11:00:00Z" --to "2026-06-01T12:00:00Z"

# Filter by path and status
grapity gateway logs payments-gateway --path /v1/payments --status 500
```

## See also

- [Gateway Overview](/platform/gateway/overview)
