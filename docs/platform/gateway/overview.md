# Gateway Overview

The Gateway module connects your registered API specs to Kong, generating configuration and collecting traffic logs.

## What it does

- **Spec-driven config**: Declare routes, upstreams, and plugins in a `gateway.config.yaml` file. The CLI validates every route against the registered spec when you push. If the route doesn't exist in the spec, the push is blocked.
- **Provisioning via decK**: The `grapity gateway provision` command fetches a stored config from the registry, generates decK-compatible YAML, and runs `deck gateway diff` (or `sync` with `--sync`) against your Kong instance.
- **Log ingestion**: Kong pushes access logs to the registry via the `http-log` plugin. The registry normalizes payloads, resolves caller identity from configurable rules, and stores structured gateway logs for querying and analysis.
- **Versioned configs**: Every push creates a new version of the gateway config. The registry keeps the latest 5 versions, so you can diff or roll back.

## External dependencies

The Registry stores and validates gateway configs, but the runtime is outside Grapity:

- **decK** must be installed and on `PATH` for `grapity gateway provision`.
- **Kong** must be running and reachable at the `kongAddr` declared in each environment.
- The **Kong `http-log` plugin** must be configured to POST to `/v1/gateway-logs/ingest/:provider/:environment`.
- **When the Registry uses Keycloak auth, log ingestion requires a bearer token.** The Kong `http-log` plugin must send an `Authorization` header with a token that has the `gateway-logs:write` scope. The operator is responsible for obtaining and rotating that token. Grapity does not manage it.

Grapity does not start or manage decK, Kong, or Keycloak.

## How it works

```
OAS spec (in registry)
    |
gateway.config.yaml  -->  grapity gateway push  -->  stored in registry
    |
grapity gateway provision  -->  decK YAML  -->  Kong
    |
http-log plugin  -->  registry log ingest  -->  queryable logs
```

## Getting started

1. Register a spec with `grapity registry push`
2. Write a `gateway.config.yaml` that references the spec
3. Run `grapity gateway push payments-gateway.config.yaml` to store it in the registry
4. Run `grapity gateway provision --name payments-gateway --env staging --sync` to apply to Kong
5. Configure the `http-log` plugin to POST logs to the registry

## Supported plugins

Kong plugins can be declared directly in `gateway.config.yaml`. Verified plugins include `rate-limiting`, `jwt`, `request-transformer`, `response-transformer`, `openid-connect`, `request-validator`, and `http-log`. See the architecture doc for YAML examples of each.

## Log querying

Once logs are flowing, use `grapity gateway logs <config>` to query traffic from the command line, or call the registry REST API directly at `GET /v1/gateway-logs`.

## See also

- [CLI Reference: grapity gateway](/cli-reference/gateway) — Manage gateway configs and logs
- [grapity serve](/cli-reference/serve) — Start the Registry and Hub
- [Registry Overview](/platform/registry/overview) — How specs are stored and validated
