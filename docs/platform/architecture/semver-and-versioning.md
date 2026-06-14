# Semver & Versioning

Grapity auto-assigns semantic versions based on compatibility analysis. You can also declare an explicit version for intentional major releases.

## Auto-assigned versions

On every push, the Registry classifies the change and bumps the version accordingly.

| Change classification | Release bump | Pre-release bump |
|------------------------|-------------|-----------------|
| Breaking change | `1.2.0` → `2.0.0` | `0.2.0` → `0.3.0` |
| Safe addition (minor) | `1.2.0` → `1.3.0` | `0.2.0` → `0.3.0` |
| Patch (no API change) | `1.2.0` → `1.2.1` | `0.2.0` → `0.2.1` |
| First push (no previous) | `1.0.0` | `0.1.0` |

## Pre-release lifecycle

Use `--prerelease` to push versions in the `0.x` range:

```bash
grapity registry push ./openapi.yaml --name payments-api --prerelease
```

Rules:

- Pre-release is only allowed when the spec does not exist yet, or the previous version is also pre-release.
- Once a spec has a release version (`1.0.0+`), it **cannot** go back to pre-release. Graduation is one-way.
- In pre-release (`0.x`), breaking changes bump **minor**, following semver convention for `0.x` versions.

## Explicit version declaration

Declare the intended target semver to signal an intentional major release:

```bash
grapity registry push ./openapi.yaml --name payments-api --version 2.0.0
```

| Scenario | Result |
|----------|--------|
| Declared major + breaking changes detected | Accepted as intentional major release |
| Declared minor/patch + breaking changes detected | Blocked with `409` (wrong version type) |
| No version declared | Auto-assigned from compat classification |

## Version classification

The `classification` field in every version tells you what changed:

- `initial` — First version of the spec
- `major` — Breaking changes detected
- `minor` — Safe additions detected
- `patch` — No API surface change (descriptions, examples only)

You can see this in the Hub under the **Changelog** tab for any version.

## See also

- [Backward Compatibility](/platform/architecture/backward-compatibility) — What counts as breaking vs safe
- [grapity registry push](/cli-reference/registry) — Push command reference
