# Using the Hub

The Grapity Hub is a developer portal for browsing, exploring, and comparing API specs registered with the Registry. It starts automatically when you run `grapity serve`.

## Opening the Hub

```bash
grapity serve
# => Hub ready at http://localhost:3000
```

Open http://localhost:3000 in your browser.

## Browse all specs

The home page shows every spec in the Registry in a searchable list.

- **Search** by name or description
- **Filter** by type (OpenAPI), owner, or tags using the sidebar
- Each card shows the spec name, type, latest version, and classification

## Spec detail page

Click any spec to open its detail page. This page has five tabs:

### Overview

The **Overview** tab renders the OpenAPI spec into an interactive endpoint explorer:

- Endpoint list grouped by resource
- Each endpoint shows its method, path, summary, and parameters
- Security requirements per endpoint: scheme name and required scopes, or "No authentication required" for public endpoints
- Request and response schemas rendered as a collapsible property tree
- Schema properties show type, format, enum values, and descriptions
- Request/response examples when present in the spec
- Generated `curl` command for each endpoint

### Changelog

The **Changelog** tab shows the compatibility report for the current version:

- Classification (`initial`, `major`, `minor`, `patch`)
- List of breaking changes with descriptions and affected paths
- List of safe changes with descriptions
- Previous version this was diffed against

### Versions

The **Versions** tab shows a timeline of every version pushed:

- Semver, classification, and push date
- Pushed-by identity and git ref
- Click any version to view its detail page

### Compare

The **Compare** tab lets you select two versions side-by-side and see their compatibility reports next to each other. Useful for evaluating whether to upgrade a dependency.

### Raw Spec

The **Raw Spec** tab shows the original OpenAPI document as formatted JSON or YAML. Copy it or download it for use with external tools (Swagger UI, Redoc, Postman, etc.).

## Direct spec URLs

You can fetch any spec directly via the Registry API without opening the Hub:

```bash
curl http://localhost:3750/v1/specs/payments-api/spec.yaml
```

Or a specific version:

```bash
curl http://localhost:3750/v1/specs/payments-api/versions/1.2.0/spec.json
```

These URLs return the correct `Content-Type` header for OpenAPI specs.

## Dark mode

The Hub defaults to dark mode. Use the toggle in the header to switch between dark and light themes.

## See also

- [grapity serve](/cli-reference/serve) — Start the Hub alongside the Registry
- [grapity registry push](/cli-reference/registry) — Push specs so they appear in the Hub
