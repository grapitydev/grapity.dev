# Backward Compatibility

The Grapity Registry diffs every pushed spec against the previous version. Breaking changes are blocked by default. Safe changes are accepted.

## What is a breaking change?

A breaking change is any modification that could cause an existing API consumer to fail.

### Blocked (breaking)

| Change | Example |
|--------|---------|
| Removing an endpoint or HTTP method | `DELETE /v1/accounts/{id}` disappears |
| Removing or renaming a required field | `userId` removed from response schema |
| Changing a field type | `string` → `integer` |
| Adding a new required request field | Body now requires `currency` |
| Narrowing an enum | Removing `EUR` from `currency` values |

### Accepted (safe)

| Change | Example |
|--------|---------|
| Adding new optional fields to responses | `metadata` added to response |
| Adding new endpoints or methods | New `PATCH /v1/accounts/{id}` |
| Adding optional request parameters | New optional query param `?include=metadata` |
| Widening an enum | Adding `CHF` to `currency` values |
| Improving descriptions or examples | Better docs, no schema change |

## How it works

When you run `grapity registry push`, the Registry:

1. Parses both the old and new spec
2. Diff the fully-resolved spec trees
3. Classifies each delta as breaking or safe
4. Assigns a semver bump based on the classification

If breaking changes are found, the push is blocked with HTTP `409`:

```json
{
  "error": "breaking_change",
  "message": "Breaking changes detected. Use force: true with a reason to override.",
  "statusCode": 409,
  "compatReport": {
    "previousVersion": "1.0.0",
    "classification": "major",
    "breakingChanges": [
      {
        "rule": "response-property-removed",
        "description": "Response property 'userId' was removed from GET /users/{id}",
        "path": "/users/{id}/GET/response/200/userId"
      }
    ],
    "safeChanges": [],
    "suggestedVersion": "2.0.0"
  }
}
```

## Resolving a blocked push

You have two options when a push is blocked:

### Option 1: Fix the spec

Restore the removed field, widen the enum, or keep the endpoint. Then push again.

### Option 2: Force push (emergency only)

```bash
grapity registry push ./openapi.yaml --name payments-api --force --reason "security fix CVE-2026-1234"
```

The force reason is recorded in the audit log. Use this only for true emergencies.

## Draft endpoints

Endpoints marked with `x-draft: true` are exempt from backward compatibility checks. Changes to draft endpoints are always safe. Once an endpoint graduates from draft to stable, it is subject to full compatibility enforcement.

## See also

- [Semver & Versioning](/platform/architecture/semver-and-versioning) — How the Registry assigns version numbers
- [Deprecation & Grace](/platform/architecture/deprecation-and-grace) — How to remove endpoints safely
