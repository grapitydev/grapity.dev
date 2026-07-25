# Troubleshooting

Common issues and how to resolve them.

## Push blocked with `409 breaking_change`

**Error:**

```text
breaking_change
Breaking changes detected. Use force: true with a reason to override.
```

**Cause:** Your spec contains changes that break backward compatibility with the previous version.

**Fix options:**

1. **Fix the spec** — restore removed fields, keep endpoints, or widen enums
2. **Force push** — `grapity registry push ./spec.yaml --name api --force --reason "your reason"`

See [Backward Compatibility](/platform/architecture/backward-compatibility) for the full list of blocked and safe changes.

---

## `grapity init` complains about missing `--url`

**Error:**

```text
missing flag
--url is required for remote mode.
```

**Cause:** You passed `--remote` without `--url`.

**Fix:**

```bash
grapity init --remote --url https://api.grapity.dev \
  --auth keycloak \
  --keycloak-server https://keycloak.example.com \
  --keycloak-realm grapity \
  --keycloak-client-id grapity-cli \
  --keycloak-audience grapity-cli
```

Then set the client secret before running commands:

```bash
export GRAPITY_CLIENT_SECRET="your-client-secret"
```

---

## Hub shows "index.html not found"

**Error:**

```text
index.html not found. Build the project with 'bun run build' first.
```

**Cause:** The Hub production assets were not built. `hub/serve` serves files from `dist/hub/`, which does not exist.

**Fix:**

```bash
cd node_modules/@grapity/grapity
bun install
bun run build
```

Or install from source with the build step included.

---

## Spec not found after push

**Error:**

```text
not_found
Spec "payments-api" not found
```

**Cause:**

1. You are talking to a different Registry than the one you pushed to (check `~/.grapity/config.yaml`)
2. The push failed and the spec was never created
3. You are using the wrong spec name (names are case-sensitive)

**Fix:**

```bash
# Verify your config
cat ~/.grapity/config.yaml

# List all specs to confirm the name
grapity registry list
```

---

## SQLite database is locked

**Error:**

```text
database is locked
```

**Cause:** Another process is using the SQLite database file. This happens if you started `grapity serve` twice, or if another tool has the file open.

**Fix:**

```bash
# Find and kill the other process
lsof ~/.grapity/registry.db
kill <PID>

# Or use a different database file
grapity serve --db /tmp/grapity-test.db
```

---

## `grapity serve` fails with "auth is not configured"

**Error:**

```text
Auth is not configured.
Configure it with: grapity init --local --auth keycloak ...
Or run with: grapity serve --no-auth
```

**Cause:** Your `~/.grapity/config.yaml` does not contain an `auth` section, but you did not pass `--no-auth`.

**Fix:**

- For local development without auth: `grapity serve --no-auth`
- For local development with Keycloak: follow the [local Keycloak setup](/cli-reference/init#local-mode-with-keycloak)

---

## `grapity serve` fails with "Keycloak is not reachable"

**Error:**

```text
Keycloak is not reachable at http://localhost:8080/realms/grapity
See https://grapity.dev/docs/cli-reference/init#local-mode-with-keycloak to set up a local Keycloak server.
```

**Cause:** Auth is configured in `~/.grapity/config.yaml`, but the Keycloak server is not running or the realm is not imported.

**Fix:**

```bash
mkdir -p grapity-examples/keycloak
curl -L https://grapity.dev/docs/examples/docker-compose.keycloak.yml \
  -o grapity-examples/docker-compose.keycloak.yml
curl -L https://grapity.dev/docs/examples/keycloak/realm-export.json \
  -o grapity-examples/keycloak/realm-export.json
cd grapity-examples
docker compose -f docker-compose.keycloak.yml down -v
docker compose -f docker-compose.keycloak.yml up -d
```

The `-v` flag is required because Keycloak only imports the realm on first startup.

---

## CLI commands fail with `401 unauthorized`

**Error:**

```text
unauthorized
Missing or invalid Authorization header
```

**Cause:** The Registry requires Keycloak auth, but the CLI could not obtain a token. Common reasons:

- `GRAPITY_CLIENT_SECRET` is not set
- The Keycloak client is not configured for `client_credentials`
- The Keycloak server is unreachable

**Fix:**

```bash
export GRAPITY_CLIENT_SECRET="your-client-secret"
grapity auth status
```

If `auth status` fails, verify your Keycloak client has:

- `client_credentials` grant enabled
- Service account enabled
- Scopes for the operations you need

---

## CLI commands fail with `403 forbidden`

**Error:**

```text
forbidden
Insufficient scopes
```

**Cause:** The CLI token is valid but does not include the scope required by the operation.

**Fix:** In Keycloak, assign the required scopes to the `grapity-cli` client. For example:

- `grapity registry push` requires `specs:write`
- `grapity registry list` requires `specs:read`

The exact scopes are declared in `openapi.yaml` under each operation's `security` requirements.

---

## Hub login fails or redirects back with an error

**Cause:** The public Hub client (`grapity-hub`) in Keycloak is misconfigured.

**Fix:** Verify the client has:

- Standard flow enabled
- PKCE method set to `S256`
- Valid redirect URIs matching the Hub origin (for example `http://localhost:3000/*`)
- A valid post-logout redirect URI if you use sign-out

If you changed `realm-export.json`, restart Keycloak with `docker compose down -v && docker compose up -d` to re-import. You can download the latest example files from [Examples](/examples/).

---

## Hub stays signed out after Keycloak redirect

**Cause:** The Hub did not receive or store the token correctly after the callback.

**Fix:**

1. Check the browser console for errors.
2. Confirm the redirect URI matches exactly what Keycloak expects (trailing slash matters).
3. Clear site data and sign in again.

---

## Getting help

If your issue is not listed here:

1. Check the [GitHub Issues](https://github.com/grapitydev/grapity/issues) for similar reports
2. Run the command with `--help` for usage details
3. Check the [CLI Reference](/cli-reference/init) and [Architecture](/platform/architecture/backward-compatibility) docs
