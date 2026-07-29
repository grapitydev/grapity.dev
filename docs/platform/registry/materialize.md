# Materialize

Registered specs can be pulled into any repository with `grapity materialize`. This is useful for:

- **Producers** generating server stubs, types, or tests from their own spec.
- **Consumers** fetching a version-pinned contract to generate clients and types.

## How it works

`grapity materialize` resolves the spec through the CLI auth, writes the pinned version to `grapity.yaml`, and records resolved/latest metadata in `grapity-lock.json`. It warns when the pinned version is no longer the latest registry version, so repos can detect drift in CI.

## Drift detection in CI

`grapity materialize --check` compares the lockfile against the live registry without writing files. A ready-to-copy GitHub Actions workflow that runs the check on every pull request and reports drift as a sticky PR comment is available in the grapity repository at [`examples/materialize-check/`](https://github.com/grapitydev/grapity/tree/main/examples/materialize-check).

## Configuration file

`grapity.yaml` declares which specs the repository consumes. It is created automatically on first materialize and can be edited by hand.

```yaml
version: "1"

specs:
  - name: payments-api
    semver: "1.2.0"
    output: ./grapity/specs/payments-api.yaml
    format: yaml

  - name: users-api
    # omit semver to track latest; the CLI writes the resolved version back
```

## Lockfile

`grapity-lock.json` records the resolved state at materialize time:

```json
{
  "version": "1",
  "specs": {
    "payments-api": {
      "requested": "1.2.0",
      "resolved": "1.2.0",
      "latest": "1.3.0",
      "stale": true,
      "fetchedAt": "2026-06-20T12:00:00Z"
    }
  }
}
```

## See also

- [CLI Reference: grapity materialize](/cli-reference/materialize) — Full command usage and examples
- [Registry Overview](/platform/registry/overview) — How specs are stored and validated
