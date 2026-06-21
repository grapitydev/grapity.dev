# Registry Configuration

The Registry reads configuration from `~/.grapity/config.yaml`, which is created by `grapity init`.

## Local mode

```yaml
mode: local
local:
  port: 3750
  database: sqlite
  sqlitePath: ~/.grapity/registry.db
```

In local mode you can choose SQLite (default) or PostgreSQL. Credentials for PostgreSQL can be passed directly via `grapity init --db` or, for production, via the `GRAPITY_DATABASE_URL` environment variable.

## Remote mode

```yaml
mode: remote
remote:
  url: https://api.grapity.dev
```

In remote mode the CLI connects to a Registry already running at the configured URL. The remote Registry is operated by your organization or by Grapity Cloud.

## Authentication

The `auth` block is optional. When omitted, the server defaults to `none`.

- **`none`**: No authentication. All endpoints accept anonymous requests. Use this for local development with `grapity serve --no-auth`.
- **`keycloak`**: OIDC/JWT bearer tokens issued by Keycloak. The Registry validates tokens against the realm's JWKS endpoint and enforces OAuth2 scopes declared in `openapi.yaml` for each operation.

::: warning
Enabling auth makes Keycloak a hard dependency. If Keycloak is unreachable, `grapity serve` will not start. Anonymous requests are rejected with `401`, and requests without the required scopes are rejected with `403`.
:::

## See also

- [CLI Reference: grapity init](/cli-reference/init) — Create and update `~/.grapity/config.yaml`
- [CLI Reference: grapity auth](/cli-reference/auth) — Check authentication status and clear the token cache
- [Registry Overview](/platform/registry/overview) — What the Registry does and how to run it
