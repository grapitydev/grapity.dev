# Deprecation & Grace

Grapity enforces a grace period before you can remove a deprecated endpoint or field. This gives downstream consumers time to migrate.

## How deprecation works

Deprecation is expressed entirely through your spec document. No dedicated API endpoints or registry UI actions are needed.

Mark an endpoint as deprecated:

```yaml
paths:
  /v1/legacy-payments:
    get:
      deprecated: true
      x-sunset: "2026-12-01"
      summary: List legacy payments (deprecated)
```

When you push this spec, the Registry records that the endpoint is deprecated and notes the sunset date.

## Grace period enforcement

The Registry enforces two rules at push time:

1. **Cannot remove an endpoint that was not deprecated in the previous version.**
   If `GET /v1/legacy-payments` existed in v1.0.0 and you try to remove it in v1.1.0 without first deprecating it, the push is blocked.

2. **Cannot remove a deprecated endpoint before its sunset date has passed.**
   If `x-sunset` is `2026-12-01`, you cannot remove the endpoint until `2026-12-02` or later.

## Grace period length

Default: **30 days** between deprecation and allowed removal.

Configure a custom grace period when starting the Registry:

```bash
grapity serve --grace-period-days 90
```

## Safe deprecation workflow

1. **Version N** — Endpoint is stable
2. **Version N+1** — Mark endpoint `deprecated: true` with `x-sunset` date
3. **Wait** — Grace period elapses (default 30 days)
4. **Version N+2** — Remove the endpoint. Push is accepted because sunset has passed.

## Force override

In true emergencies, you can bypass grace period checks with `--force`:

```bash
grapity registry push ./openapi.yaml --name payments-api --force --reason "security fix CVE-2026-1234"
```

The force reason is recorded in the audit log.

## See also

- [Backward Compatibility](/platform/architecture/backward-compatibility) — Full list of blocked and safe changes
- [grapity registry push](/cli-reference/registry) — Push command options
