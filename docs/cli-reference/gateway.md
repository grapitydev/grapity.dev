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
grapity gateway push <config-file>
```

Validates declared routes against the registered spec and stores the config in the registry. If a route does not exist in the linked spec, the push is blocked.

## grapity gateway get

Show details for a gateway config.

```bash
grapity gateway get <name>
```

Use `--version <uuid>` to view a specific version.

## grapity gateway versions

List all versions for a gateway config.

```bash
grapity gateway versions <name>
```

## grapity gateway config

Fetch the raw gateway config YAML from the registry.

```bash
grapity gateway config <name>
```

Use `--version <uuid>` for a specific version, or `--output <file>` to write to a file.

## grapity gateway preview

Render decK YAML from a gateway config without running decK.

```bash
# From a local file
grapity gateway preview ./payments-gateway.config.yaml --env staging

# From the registry
grapity gateway preview --name payments-gateway --env staging
```

Use `--output <file>` to write the decK YAML to a file.

## grapity gateway provision

Provision a gateway config to Kong via decK.

```bash
grapity gateway provision --name payments-gateway --env staging
```

Fetches the latest version from the registry, generates decK YAML, and runs `deck gateway diff` against the environment's Kong admin API. Use `--sync` to apply changes. Use `--version <uuid>` to target a specific version.

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
