# grapity materialize

Fetch registered specs from the Grapity Registry into the current repository.

## Usage

```bash
grapity materialize [name] [options]
grapity materialize --check
```

## Description

`grapity materialize` resolves specs through the existing CLI auth and writes them into the current repository. It pins the exact resolved version in `grapity.yaml`, records resolved/latest metadata in `grapity-lock.json`, and warns when the pinned version is no longer the latest registry version.

This command does not generate code. Use your existing language tooling (for example `openapi-typescript`, `openapi-generator`, or `oapi-codegen`) with the materialized spec files.

## Arguments

| Argument | Description |
|----------|-------------|
| `[name]` | Name of the spec to materialize. Omit to materialize every spec declared in `grapity.yaml`. |

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--semver <semver>` | Specific version to materialize | Value from `grapity.yaml`, or latest |
| `--output <path>` | Destination path for the spec file | Value from `grapity.yaml`, or `./grapity/specs/<name>.yaml` |
| `--format <format>` | Output format: `yaml` or `json` | Value from `grapity.yaml`, or `yaml` |
| `--force` | Overwrite an existing file even if it differs | false |
| `--fail-on-stale` | Exit with an error when the resolved version is not the latest | false |
| `--config <path>` | Path to `grapity.yaml` | `./grapity.yaml` |
| `--check` | Verify lockfile specs are still the latest registry versions | false |

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

## Examples

### Materialize a single spec with a pinned version

```bash
grapity materialize payments-api --semver 1.2.0
```

### Materialize every spec declared in `grapity.yaml`

```bash
grapity materialize
```

### Generate TypeScript types from the materialized spec

```bash
grapity materialize payments-api
npx openapi-typescript ./grapity/specs/payments-api.yaml --output ./src/generated/payments-api.ts
```

### Check all specs for newer registry versions

```bash
grapity materialize --check
```

### Fail CI when any spec is stale

```bash
grapity materialize --check --fail-on-stale
```

## Lockfile

Every successful materialize writes `./grapity-lock.json`:

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

## Stale-version warnings

When the resolved version is not the latest registry version, a warning is printed to stderr. Use `--fail-on-stale` to make the command exit non-zero.

## See also

- [grapity init](/cli-reference/init) — Configure the CLI
- [grapity registry push](/cli-reference/registry) — Publish a spec to the registry
- [grapity serve](/cli-reference/serve) — Start the Registry server
