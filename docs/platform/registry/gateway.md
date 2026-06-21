# Registry Gateway Integration

Gateway configs are stored and validated by the Registry, but the runtime is outside it.

## Provisioning

`grapity gateway provision` fetches a stored config from the registry, generates decK-compatible YAML, and runs `deck gateway diff` (or `sync` with `--sync`) against your Kong instance.

Provisioning requires:

- **decK** installed and on `PATH`
- **Kong** running and reachable at the `kongAddr` declared in each environment

## Log ingestion

Kong pushes access logs to the registry via the `http-log` plugin. The registry normalizes payloads, resolves caller identity from configurable rules, and stores structured gateway logs for querying and analysis.

The Kong `http-log` plugin must be configured to POST to `/v1/gateway-logs/ingest/:provider/:environment`.

## Authentication for log ingestion

When the Registry uses Keycloak auth, log ingestion requires a bearer token. The Kong `http-log` plugin must send an `Authorization` header with a token that has the `gateway-logs:write` scope. The operator is responsible for obtaining and rotating that token. Grapity does not manage it for you.

## Provisioning is explicit

Pushing a gateway config to the Registry does not change Kong. You must run `grapity gateway provision --sync` to apply it.

## See also

- [CLI Reference: grapity gateway](/cli-reference/gateway) — Manage gateway configs and logs
- [Gateway Overview](/platform/gateway/overview) — How the Gateway module works
- [Quickstart](/getting-started/quickstart) — Full local Kong setup
- [Registry Overview](/platform/registry/overview) — How specs are stored and validated
