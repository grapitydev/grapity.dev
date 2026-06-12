# Registry Overview

The Registry is the contract guardian. Every API spec that enters your organisation passes through it, and every spec that fails its checks is blocked before it can break a consumer.

## What it does

### Validates backward compatibility
Every push is diffed against the previous version. Breaking changes are blocked with a precise explanation of what changed and which consumers are affected. Not just rejected. Explained.

### Enforces semver discipline
The Registry enforces version increments and suggests the correct bump based on what changed. You cannot ship v1.2.0 when you removed a required field. The Registry knows, and it will not let you.

### Manages deprecation lifecycles
When a version is deprecated, the Registry tracks which consumers depend on it, when the sunset date is, and what the migration path is. Sunset is enforced by the Registry, not by whoever happens to remember.

## Running modes

### Local mode (SQLite)

```bash
grapity serve
```

The Registry starts on port 3750 with an embedded SQLite database. No configuration required. Ideal for single-developer machines and CI pipelines.

### Remote mode

```bash
grapity init --remote --url https://api.grapity.dev
```

The CLI connects to a remote Registry at the configured URL. The remote Registry is operated by your organization or by Grapity Cloud.

## Architecture

The Registry exposes an HTTP API on port 3750 (configurable). The CLI and Hub communicate with it directly.

```
┌─────────────┐     HTTP      ┌──────────┐     SQLite
│  CLI / Hub  │ ◄───────────► │ Registry │ ◄─────────────►
└─────────────┘               └──────────┘   Spec history
```

## Key endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /v1/specs` | Push a new spec version |
| `GET /v1/specs/:name` | Get spec metadata and latest version |
| `GET /v1/specs/:name/versions` | List all versions of a spec |
| `GET /v1/specs/:name/versions/:semver` | Retrieve a specific version |
| `GET /v1/specs/:name/compat/:semver` | Compatibility report for a version |
| `GET /v1/health` | Health check |

The full API specification is available at `/v1/openapi.yaml` on any running Registry instance.

## Configuration

The Registry reads configuration from `~/.grapity/config.yaml`:

```yaml
mode: local
local:
  port: 3750
  sqlitePath: ~/.grapity/registry.db
```

For remote mode:

```yaml
mode: remote
remote:
  url: https://api.grapity.dev
```

## Next steps

- [Installation options](/getting-started/installation)
- [CLI Reference: grapity registry](/cli-reference/registry)
- [Backward Compatibility](/platform/architecture/backward-compatibility)
