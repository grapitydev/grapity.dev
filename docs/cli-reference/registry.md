# grapity registry

Manage specs in the Grapity Registry.

## Usage

```bash
grapity registry <command> [options]
```

## Description

Use `grapity registry` to publish, validate, inspect, and delete API specs in the Grapity Registry.

## Commands

| Command | Description |
|---------|-------------|
| `push <file>` | Push a spec to the Registry |
| `validate <file>` | Validate a spec without storing it |
| `list` | List all specs |
| `get <name>` | Get spec metadata and latest version |
| `update <name>` | Update spec metadata (visibility) |
| `versions <name>` | List all versions of a spec |
| `spec <name>` | Fetch the raw spec document |
| `delete <name>` | Delete a spec and all its versions |

## grapity registry push

Push a spec file to the Registry. Validates structure, checks backward compatibility, assigns a semver, and stores the result.

### Usage

```bash
grapity registry push <file> --name <name> [options]
```

### Arguments

| Argument | Description |
|----------|-------------|
| `<file>` | Path to the OpenAPI spec file |

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--name <name>` | **Required.** Spec name (URL-friendly identifier) | — |
| `--type <type>` | Spec type: `openapi` | `openapi` |
| `--description <desc>` | Description of the spec | — |
| `--owner <owner>` | Owner team or individual | — |
| `--source-repo <url>` | Source repository URL | — |
| `--tags <tags>` | Comma-separated tags | — |
| `--visibility <visibility>` | Spec visibility: `private` (authenticated reads only) or `public` (anonymous reads allowed). On an existing spec, supplying it updates visibility; omitting it leaves it unchanged | `private` on first push |
| `--git-ref <ref>` | Git commit SHA | — |
| `--pushed-by <by>` | Pusher identity (user or CI) | — |
| `--force` | Force push even with breaking changes | false |
| `--reason <reason>` | Reason for force push (required with `--force`) | — |
| `--prerelease` | Push as pre-release version (`0.x`) | false |

### Examples

Push a new spec:

```bash
grapity registry push ./openapi.yaml --name payments-api
```

Push with metadata:

```bash
grapity registry push ./openapi.yaml --name payments-api \
  --description "Payments API v2" \
  --owner platform-team \
  --tags payments,public \
  --git-ref abc1234
```

Force push a breaking change:

```bash
grapity registry push ./openapi.yaml --name payments-api \
  --force --reason "security fix CVE-2026-1234"
```

## grapity registry validate

Validate a spec against the latest version in the Registry without storing anything.

### Usage

```bash
grapity registry validate <file> --against <name>
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--against <name>` | **Required.** Spec name to validate against | — |

### Example

```bash
grapity registry validate ./openapi.yaml --against payments-api
```

Output shows whether the spec is valid and lists any breaking or safe changes.

The command exits `1` when the spec is invalid or contains blocked breaking changes, so it can gate CI jobs. Sunset-eligible removals still exit `0`.

## grapity registry list

List all specs in the Registry.

### Usage

```bash
grapity registry list [options]
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--type <type>` | Filter by spec type: `openapi` | — |
| `--owner <owner>` | Filter by owner | — |
| `--tags <tags>` | Comma-separated tag filter | — |

### Example

```bash
grapity registry list --type openapi --owner platform-team
```

## grapity registry get

Get metadata and latest version details for a spec.

### Usage

```bash
grapity registry get <name>
```

### Example

```bash
grapity registry get payments-api
```

## grapity registry update

Update mutable spec metadata without creating a new version. Currently supports changing visibility to publish or unpublish anonymous read access.

### Usage

```bash
grapity registry update <name> --visibility <visibility>
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--visibility <visibility>` | **Required.** New visibility: `private` or `public` | — |

### Examples

Publish a spec so anyone can read it without a token:

```bash
grapity registry update payments-api --visibility public
```

Make it private again:

```bash
grapity registry update payments-api --visibility private
```

## grapity registry versions

List all versions of a spec, newest first.

### Usage

```bash
grapity registry versions <name> [options]
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--limit <n>` | Maximum versions to return (max 25) | `10` |
| `--offset <n>` | Number of versions to skip | `0` |

### Example

```bash
grapity registry versions payments-api --limit 5
```

## grapity registry spec

Fetch the raw spec document for an API. Prints to stdout, pipe-friendly.

### Usage

```bash
grapity registry spec <name> [options]
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--semver <semver>` | Specific version | latest |
| `--format <format>` | Output format: `json` or `yaml` | `yaml` |

### Examples

Latest version as YAML:

```bash
grapity registry spec payments-api
```

Latest as JSON:

```bash
grapity registry spec payments-api --format json
```

Specific version:

```bash
grapity registry spec payments-api --semver 1.2.0
```

Pipe to another tool:

```bash
grapity registry spec payments-api | yq '.info.title'
```

## grapity registry delete

Delete a spec and all its versions from the registry.

### Usage

```bash
grapity registry delete <name> [options]
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `-f, --force` | Skip confirmation prompt | false |

### Example

```bash
grapity registry delete payments-api
```

## See also

- [grapity init](/cli-reference/init) — Configure the CLI
- [grapity materialize](/cli-reference/materialize) — Fetch a registered spec into the current repository
- [grapity serve](/cli-reference/serve) — Start the Registry server
