# GitHub Actions CI

One composite action covers both sides of the contract lifecycle, without running CLI commands by hand: `grapitydev/grapity/actions/grapity`.

- **Producers** validate API changes on every pull request and publish new spec versions on merge (`command: validate` / `command: push`).
- **Consumers** check materialized specs for drift on every pull request and report it as a sticky PR comment (`command: check`).

Ready-to-copy workflows with every variable and secret listed in the file header live in the grapity repository: [`examples/producer/contract.yml`](https://github.com/grapitydev/grapity/blob/main/examples/producer/contract.yml) and [`examples/consumer/materialize-check.yml`](https://github.com/grapitydev/grapity/blob/main/examples/consumer/materialize-check.yml).

## Producer: validate and push

- **On pull requests**: runs `grapity registry validate` against your registry. Breaking changes fail the check, and the compatibility report appears in the job summary.
- **On merge to main**: runs `grapity registry push`. The registry diffs against the previous version, blocks or accepts, assigns the semver, and stamps `info.version` into the stored document. Identical content registers nothing, so re-running the pipeline never creates duplicate versions.

### Prerequisites

1. A reachable Grapity registry (self-hosted, or your team's hub).
2. A Keycloak client for CI with the `specs:write` scope (client credentials grant).
3. The client secret stored as a repository secret, for example `GRAPITY_CI_CLIENT_SECRET`.

### Workflow

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
      - uses: grapitydev/grapity/actions/grapity@main
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
      - uses: grapitydev/grapity/actions/grapity@main
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

## Consumer: drift check

On pull requests, runs `grapity materialize --check --json` and upserts a sticky PR comment with the freshness status of every spec in `grapity-lock.json` (outdated specs with materialized vs latest versions, or an all-clear note). Stale specs also appear as inline `::warning::` annotations in the checks UI. It warns by default; add `fail-on-stale: "true"` to fail the job on drift (the comment still posts).

```yaml
name: Grapity materialize check

on:
  pull_request:

permissions:
  contents: read
  pull-requests: write

jobs:
  materialize-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: grapitydev/grapity/actions/grapity@main
        with:
          command: check
          registry-url: ${{ vars.GRAPITY_REGISTRY_URL }}
          auth-mode: none # public specs; use keycloak with the inputs below for authenticated registries
```

A live consumer repository running this workflow is available at [grapitydev/example-consumer-github](https://github.com/grapitydev/example-consumer-github).

Pin the action to a release tag for reproducibility, for example `grapitydev/grapity/actions/grapity@v0.17.0`, and match `cli-version` if you need a specific CLI.

## Action inputs

| Input | Commands | Required | Description |
|-------|----------|----------|-------------|
| `command` | all | yes | `validate`, `push`, or `check` |
| `registry-url` | all | yes | Registry or hub base URL |
| `auth-mode` | all | no | `keycloak` (default) or `none` for public specs |
| `keycloak-server-url` | all | when `auth-mode: keycloak` | Keycloak server URL |
| `realm` | all | when `auth-mode: keycloak` | Keycloak realm |
| `client-id` | all | when `auth-mode: keycloak` | CI client id (producers need `specs:write`, consumers `specs:read`) |
| `client-secret` | all | when `auth-mode: keycloak` | CI client secret |
| `audience` | all | no | Keycloak audience |
| `spec` | validate, push | yes | Path to the OpenAPI or AsyncAPI document |
| `name` | validate, push | yes | Spec name in the registry |
| `visibility` | push | no | `private` or `public` |
| `prerelease` | push | no | `true` publishes 0.x pre-release versions |
| `git-ref` | push | no | Defaults to `github.sha` |
| `pushed-by` | push | no | Defaults to `github.actor` |
| `fail-on-stale` | check | no | `true` fails the job when specs are stale (default warns only) |
| `post-comment` | check | no | `false` disables the sticky PR comment (default `true`, requires `pull-requests: write`) |
| `comment-header` | check | no | Sticky comment header key (default `materialize-check`) |
| `cli-version` | all | no | CLI version to install (default `latest`) |

## Notes

- **First registration**: when no spec exists for `name` yet, `validate` checks the schema and reports an `initial` classification instead of failing, so the very first pull request and merge pass the gate before anything is registered.
- **Forks**: pull requests from forks do not receive repository secrets, so validation only runs for branches in your own repository. This is a GitHub limitation, not a Grapity one.
- **Breaking changes**: a breaking push is blocked with `409` and fails the job. Emergency overrides stay manual: run `grapity registry push --force --reason "..."` yourself, which records the reason in the audit log.
- **Public APIs**: add `visibility: public` to the push step to make the spec readable without a token, which is what powers a public Hub portal.
- **Pre-release APIs**: add `prerelease: "true"` to the push step to keep versions in the 0.x line (`0.1.0`, then minor bumps) while your API is unstable. Removing it later graduates the spec to `1.0.0` on the next push.
- **Other CI systems**: the action is GitHub-only convenience. Every command maps to a CLI invocation (`grapity registry validate`, `grapity registry push`, `grapity materialize --check --json`), so GitLab and others can build the same flow on the CLI directly.

## See also

- [Public specs and anonymous reads](/platform/registry/overview#public-specs-and-anonymous-reads)
- [grapity registry push](/cli-reference/registry#grapity-registry-push)
- [grapity materialize](/cli-reference/materialize)
- [Semver and Versioning](/platform/architecture/semver-and-versioning)
