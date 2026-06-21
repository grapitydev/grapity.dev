# Platform

Grapity is built from integrated components that work together to govern your API contracts.

## Architecture

The rules that govern every API contract in your organisation.

- [Backward Compatibility](/platform/architecture/backward-compatibility) — What changes are blocked and why
- [Semver & Versioning](/platform/architecture/semver-and-versioning) — How version numbers are enforced
- [Deprecation & Grace](/platform/architecture/deprecation-and-grace) — Managing the lifecycle of old versions

## Registry

The contract guardian. Every spec passes through it before it can be consumed.

- [Overview](/platform/registry/overview) — What the Registry does and how to run it
- [Configuration](/platform/registry/configuration) — Registry and CLI configuration
- [Materialize](/platform/registry/materialize) — Pull registered specs into repositories
- [Gateway integration](/platform/registry/gateway) — Connect Registry specs to Kong

## Hub

The developer portal where teams browse, explore, and compare API specs.

- [Overview](/platform/hub/overview) — Open the Hub and browse specs
- [Spec detail page](/platform/hub/spec-detail) — Explore endpoints, changelog, versions, and raw spec

## Gateway

Generates Kong config from the registered spec and ingests gateway logs for traffic analysis.

- [Overview](/platform/gateway/overview) — How the Gateway module works
