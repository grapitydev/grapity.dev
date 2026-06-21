# grapity gateway

Manage gateway configs and query gateway logs.

## Usage

```bash
grapity gateway <command> [options]
```

## Description

Use `grapity gateway` to publish, inspect, preview, provision, and debug gateway configs in the Grapity Registry.

## Commands

| Command | Description |
|---------|-------------|
| `list` | List all gateway configs |
| `push <file>` | Push a gateway config file to the Registry |
| `get <name>` | Show details for a gateway config |
| `versions <name>` | List all versions for a gateway config |
| `config <name>` | Fetch the raw gateway config YAML |
| `preview [file]` | Render decK YAML without running decK |
| `provision` | Provision a gateway config to Kong via decK |
| `logs <config-name>` | Query gateway logs |

## Prerequisites

Some `grapity gateway` commands depend on services and tools that Grapity does not install or start for you:

| Command | Dependencies |
|---------|-------------|
| `push`, `list`, `get`, `versions`, `config` | A running Registry (local or remote) |
| `preview` | A running Registry when using `--name` |
| `provision` | A running Registry, the `deck` binary on `PATH`, and a reachable Kong Admin API for the target environment |
| `logs` | A running Registry and Kong pushing logs via the `http-log` plugin |

When the Registry uses Keycloak auth, ensure `GRAPITY_CLIENT_SECRET` is set (or use `GRAPITY_TOKEN`). For log ingestion, Kong's `http-log` plugin must also send a bearer token with the `gateway-logs:write` scope; Grapity does not manage that token for you.

## grapity gateway list

List all gateway configs stored in the registry.

### Usage

```bash
grapity gateway list
```

## grapity gateway push

Push a gateway config file to the registry.

### Usage

```bash
grapity gateway push <config-file> [options]
```

### Arguments

| Argument | Description |
|----------|-------------|
| `<config-file>` | Path to the gateway config file |

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--pushed-by <by>` | Pusher identity (user or CI) | — |

Validates declared routes against the registered spec and stores the config in the registry. If a route does not exist in the linked spec, the push is blocked.

## grapity gateway get

Show details for a gateway config.

### Usage

```bash
grapity gateway get <name> [options]
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--version <uuid>` | Specific version UUID | latest |

## grapity gateway versions

List all versions for a gateway config.

### Usage

```bash
grapity gateway versions <name>
```

## grapity gateway config

Fetch the raw gateway config YAML from the registry.

### Usage

```bash
grapity gateway config <name> [options]
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--version <uuid>` | Specific version UUID | latest |
| `--output <file>` | Write output to a file instead of stdout | stdout |

## grapity gateway preview

Render decK YAML from a gateway config without running decK.

### Usage

```bash
grapity gateway preview [file] [options]
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--env <name>` | **Required.** Target environment name | — |
| `--name <name>` | Gateway config name (registry mode) | — |
| `--version <uuid>` | Specific version UUID (registry mode) | latest |
| `--output <file>` | Write decK YAML to a file instead of stdout | stdout |

### Examples

From a local file:

```bash
grapity gateway preview ./payments-gateway.config.yaml --env staging
```

From the registry:

```bash
grapity gateway preview --name payments-gateway --env staging
```

## grapity gateway provision

Provision a gateway config to Kong via decK.

### Usage

```bash
grapity gateway provision --name <name> --env <env> [options]
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--name <name>` | **Required.** Gateway config name | — |
| `--env <name>` | **Required.** Target environment name | — |
| `--version <uuid>` | Specific config version | latest |
| `--sync` | Apply changes via `deck sync` (default is `deck diff`) | false |

Fetches the latest version from the registry, generates decK YAML, and runs `deck gateway diff` against the environment's Kong admin API.

## grapity gateway logs

Query gateway logs stored in the registry.

### Usage

```bash
grapity gateway logs <config-name> [options]
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--stats` | Show aggregate statistics instead of individual logs | false |
| `--env <name>` | Filter by environment (e.g., `staging`, `prod`) | — |
| `--path <path>` | Filter by request path | — |
| `--method <method>` | Filter by HTTP method | — |
| `--status <status>` | Filter by response status code | — |
| `--from <timestamp>` | Start timestamp (ISO 8601) | — |
| `--to <timestamp>` | End timestamp (ISO 8601) | — |
| `--limit <n>` | Maximum number of results | `20` |
| `--offset <n>` | Result offset for pagination | `0` |

### Examples

List recent logs for the payments gateway:

```bash
grapity gateway logs payments-gateway
```

Show stats for production traffic in the last hour:

```bash
grapity gateway logs payments-gateway --stats --env prod --from "2026-06-01T11:00:00Z" --to "2026-06-01T12:00:00Z"
```

Filter by path and status:

```bash
grapity gateway logs payments-gateway --path /v1/payments --status 500
```

## See also

- [grapity init](/cli-reference/init) — Configure the CLI
- [grapity registry](/cli-reference/registry) — Push and manage specs
- [Gateway Overview](/platform/gateway/overview)
