# Spec detail page

Click any spec in the Hub to open its detail page. The page has five tabs.

## Overview

The **Overview** tab renders the OpenAPI spec into an interactive endpoint explorer:

- Endpoint list grouped by resource
- Each endpoint shows its method, path, summary, and parameters
- Security requirements per endpoint: scheme name and required scopes, or "No authentication required" for public endpoints
- Request and response schemas rendered as a collapsible property tree
- Schema properties show type, format, enum values, and descriptions
- Request/response examples when present in the spec
- Generated `curl` command for each endpoint

## Changelog

The **Changelog** tab shows the compatibility report for the current version:

- Classification (`initial`, `major`, `minor`, `patch`)
- List of breaking changes with descriptions and affected paths
- List of safe changes with descriptions
- Previous version this was diffed against

## Versions

The **Versions** tab shows a timeline of every version pushed:

- Semver, classification, and push date
- Pushed-by identity and git ref
- Click any version to view its detail page

## Compare

The **Compare** tab lets you select two versions side-by-side and see their compatibility reports next to each other. Useful for evaluating whether to upgrade a dependency.

## Raw Spec

The **Raw Spec** tab shows the original OpenAPI document as formatted JSON or YAML. Copy it or download it for use with external tools (Swagger UI, Redoc, Postman, etc.).

## See also

- [Hub Overview](/platform/hub/overview) — Open the Hub and browse specs
- [Backward Compatibility](/platform/architecture/backward-compatibility) — How changes are classified
- [Semver & Versioning](/platform/architecture/semver-and-versioning) — How version numbers are enforced
