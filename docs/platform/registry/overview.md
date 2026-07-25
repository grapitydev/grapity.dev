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
grapity serve --no-auth
```

The Registry starts on port 3750 with an embedded SQLite database. Pass `--no-auth` for local development without Keycloak. For production-like setups, configure Keycloak auth and omit `--no-auth`.

::: warning
`--no-auth` disables authentication entirely. It is intended only for local development. Do not use it in production or on any shared network.
:::

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

## Direct spec URLs

You can fetch any spec directly via the Registry API without opening the Hub:

```bash
curl http://localhost:3750/v1/specs/payments-api/spec.yaml
```

Or a specific version:

```bash
curl http://localhost:3750/v1/specs/payments-api/versions/1.2.0/spec.json
```

These URLs return the correct `Content-Type` header for OpenAPI specs. The served document's `info.version` is always the Registry-assigned version: it is rewritten at push time, so the document stays consistent with the version in the URL.

## Authentication

The Registry supports two authentication modes, controlled by `auth.mode` in the server configuration:

- **`none`**: No authentication. All endpoints accept anonymous requests. Use this for local development with `grapity serve --no-auth`.
- **`keycloak`**: OIDC/JWT bearer tokens issued by Keycloak. The Registry validates tokens against the realm's JWKS endpoint and enforces OAuth2 scopes declared in `openapi.yaml` for each operation.

When Keycloak is enabled, the CLI uses client credentials to fetch access tokens programmatically. The client ID is stored in `~/.grapity/config.yaml`; the client secret is always provided via the environment:

```bash
export GRAPITY_CLIENT_SECRET="your-client-secret"
```

For automation you can also provide a static bearer token:

```bash
export GRAPITY_TOKEN="eyJ..."
```

Configure the CLI for Keycloak:

```bash
grapity init --remote --url https://api.grapity.dev \
  --auth keycloak \
  --keycloak-server https://keycloak.example.com \
  --keycloak-realm grapity \
  --keycloak-client-id grapity-cli \
  --keycloak-audience grapity-cli
```

See [grapity auth](/cli-reference/auth) for checking token status and clearing the cache.

## Next steps

- [Installation options](/getting-started/installation)
- [CLI Reference: grapity registry](/cli-reference/registry)
- [Registry Configuration](/platform/registry/configuration)
- [Materialize](/platform/registry/materialize)
- [Registry Gateway Integration](/platform/registry/gateway)
- [Backward Compatibility](/platform/architecture/backward-compatibility)
