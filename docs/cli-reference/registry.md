# grapity registry

Manage specs in the Grapity Registry.

## Subcommands

| Command | Description |
|---------|-------------|
| `push <file>` | Push a spec to the Registry |
| `validate <file>` | Validate a spec without storing it |
| `list` | List all specs |
| `get <name>` | Get spec metadata and latest version |
| `versions <name>` | List all versions of a spec |
| `spec <name>` | Fetch the raw spec document |

---

## grapity registry push

Push a spec file to the Registry. Validates structure, checks backward compatibility, assigns a semver, and stores the result.

### Usage

```bash
grapity registry push <file> --name <name> [options]
```

### Arguments

| Argument | Description |
|----------|-------------|
| `<file>` | Path to the spec file (OpenAPI or AsyncAPI) |

### Options

| Option | Description |
|--------|-------------|
| `--name <name>` | **Required.** Spec name (URL-friendly identifier) |
| `--type <type>` | Spec type: `openapi` or `asyncapi` |
| `--description <desc>` | Description of the spec |
| `--owner <owner>` | Owner team or individual |
| `--source-repo <url>` | Source repository URL |
| `--tags <tags>` | Comma-separated tags |
| `--git-ref <ref>` | Git commit SHA |
| `--pushed-by <by>` | Pusher identity (user or CI) |
| `--force` | Force push even with breaking changes |
| `--reason <reason>` | Reason for force push (required with `--force`) |
| `--prerelease` | Push as pre-release version (`0.x`) |
| `--version <semver>` | Declare explicit target version |

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

Declare an intentional major release:

```bash
grapity registry push ./openapi.yaml --name payments-api --version 2.0.0
```

---

## grapity registry validate

Validate a spec against the latest version in the Registry without storing anything.

### Usage

```bash
grapity registry validate <file> --against <name>
```

### Options

| Option | Description |
|--------|-------------|
| `--against <name>` | **Required.** Spec name to validate against |

### Example

```bash
grapity registry validate ./openapi.yaml --against payments-api
```

Output shows whether the spec is valid and lists any breaking or safe changes.

---

## grapity registry list

List all specs in the Registry.

### Usage

```bash
grapity registry list [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--type <type>` | Filter by spec type: `openapi` or `asyncapi` |
| `--owner <owner>` | Filter by owner |
| `--tags <tags>` | Comma-separated tag filter |

### Example

```bash
grapity registry list --type openapi --owner platform-team
```

---

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

---

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

---

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

## See also

- [grapity init](/cli-reference/init) — Configure the CLI
- [grapity serve](/cli-reference/serve) — Start the Registry server
