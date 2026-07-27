# GitHub Actions CI

Validate API changes on every pull request and publish new spec versions on merge, without running CLI commands by hand. The `grapitydev/grapity` repository ships a composite action that wraps the CLI: `grapitydev/grapity/actions/registry`.

## What it does

- **On pull requests**: runs `grapity registry validate` against your registry. Breaking changes fail the check, and the compatibility report appears in the job summary.
- **On merge to main**: runs `grapity registry push`. The registry diffs against the previous version, blocks or accepts, assigns the semver, and stamps `info.version` into the stored document.

## Prerequisites

1. A reachable Grapity registry (self-hosted, or your team's hub).
2. A Keycloak client for CI with the `specs:write` scope (client credentials grant).
3. The client secret stored as a repository secret, for example `GRAPITY_CI_CLIENT_SECRET`.

## Workflow

```yaml
name: API contract

on:
  pull_request:
    branches: [main]
    paths: [openapi.yaml]
  push:
    branches: [main]
    paths: [openapi.yaml]

jobs:
  validate:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: grapitydev/grapity/actions/registry@main
        with:
          command: validate
          spec: openapi.yaml
          name: payments-api
          registry-url: https://registry.example.com
          keycloak-server-url: https://keycloak.example.com
          realm: grapity
          client-id: grapity-ci
          client-secret: ${{ secrets.GRAPITY_CI_CLIENT_SECRET }}

  push:
    if: github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: grapitydev/grapity/actions/registry@main
        with:
          command: push
          spec: openapi.yaml
          name: payments-api
          registry-url: https://registry.example.com
          keycloak-server-url: https://keycloak.example.com
          realm: grapity
          client-id: grapity-ci
          client-secret: ${{ secrets.GRAPITY_CI_CLIENT_SECRET }}
```

Pin the action to a release tag for reproducibility, for example `grapitydev/grapity/actions/registry@v0.12.0`, and match `cli-version` if you need a specific CLI.

## Action inputs

| Input | Required | Description |
|-------|----------|-------------|
| `command` | yes | `validate` or `push` |
| `spec` | yes | Path to the OpenAPI or AsyncAPI document |
| `name` | yes | Spec name in the registry |
| `registry-url` | yes | Registry or hub base URL |
| `keycloak-server-url` | yes | Keycloak server URL |
| `realm` | yes | Keycloak realm |
| `client-id` | yes | CI client id (needs `specs:write`) |
| `client-secret` | yes | CI client secret |
| `audience` | no | Keycloak audience |
| `visibility` | no | `private` or `public` (push only) |
| `prerelease` | no | `true` publishes 0.x pre-release versions (push only) |
| `git-ref` | no | Defaults to `github.sha` |
| `pushed-by` | no | Defaults to `github.actor` |
| `cli-version` | no | CLI version to install (default `latest`) |

## Notes

- **First registration**: when no spec exists for `name` yet, `validate` checks the schema and reports an `initial` classification instead of failing, so the very first pull request and merge pass the gate before anything is registered.
- **Forks**: pull requests from forks do not receive repository secrets, so validation only runs for branches in your own repository. This is a GitHub limitation, not a Grapity one.
- **Breaking changes**: a breaking push is blocked with `409` and fails the job. Emergency overrides stay manual: run `grapity registry push --force --reason "..."` yourself, which records the reason in the audit log.
- **Public APIs**: add `visibility: public` to the push step to make the spec readable without a token, which is what powers a public Hub portal.
- **Pre-release APIs**: add `prerelease: "true"` to the push step to keep versions in the 0.x line (`0.1.0`, then minor bumps) while your API is unstable. Removing it later graduates the spec to `1.0.0` on the next push.

## See also

- [Public specs and anonymous reads](/platform/registry/overview#public-specs-and-anonymous-reads)
- [grapity registry push](/cli-reference/registry#grapity-registry-push)
- [Semver and Versioning](/platform/architecture/semver-and-versioning)
