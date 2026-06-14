# grapity auth

Manage CLI authentication when the Registry uses Keycloak.

## Usage

```bash
grapity auth <command>
```

## Commands

| Command | Description |
|---------|-------------|
| `status` | Show current authentication status |
| `clear`  | Clear the cached access token |

## Prerequisites

These prerequisites apply when the Registry is configured to use Keycloak auth (see [`grapity init`](/cli-reference/init)).

### CLI client

The CLI authenticates with the **client credentials** flow. You need a Keycloak **confidential client** (for example `grapity-cli`) with:

- `client_credentials` grant enabled
- Service account enabled
- Scopes for the operations you need (for example `specs:read`, `specs:write`, `gateway-configs:read`, `gateway-configs:write`, `gateway-logs:read`, `gateway-logs:write`)

Set the client secret in the environment, never in the config file:

```bash
export GRAPITY_CLIENT_SECRET="your-client-secret"
```

### Hub client

The Hub authenticates with the browser **Authorization Code + PKCE** flow. You need a Keycloak **public client** (for example `grapity-hub`) with:

- Standard flow enabled
- PKCE method `S256`
- Valid redirect URIs for the Hub origin (for example `http://localhost:3000/*`)

### Example realm

A working example realm is published at [`/examples/keycloak/realm-export.json`](/examples/keycloak/realm-export.json). It defines both the `grapity-cli` and `grapity-hub` clients plus a default user `demo` / `demo`. Use it with the Keycloak Docker Compose stack at [`/examples/docker-compose.keycloak.yml`](/examples/docker-compose.keycloak.yml).

## Description

`grapity auth status` fetches or reuses a cached access token for the configured Keycloak auth and prints its status. It works for both local mode (when the Registry uses Keycloak auth) and remote mode.

The CLI caches tokens in memory until they expire. Use `grapity auth clear` to force a fresh token on the next command.

You can also bypass Keycloak entirely for automation by providing a static token:

```bash
export GRAPITY_TOKEN="eyJ..."
```

## Examples

### Check authentication status

```bash
grapity auth status
```

Output when authenticated:

```text
  ◆  Auth
  ·  Mode:      keycloak
  ·  Server:    https://keycloak.example.com
  ·  Realm:     grapity
  ·  Client ID: grapity-cli
  ·  Subject:   service-account-grapity-cli
  ·  Expires:   2026-06-13T15:00:00.000Z
```

### Clear the cached token

```bash
grapity auth clear
```

## See also

- [grapity init](/cli-reference/init) — Configure the CLI, including Keycloak credentials
- [grapity serve](/cli-reference/serve) — Start the local Registry server
