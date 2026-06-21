# Hub Overview

The Grapity Hub is a developer portal for browsing, exploring, and comparing API specs registered with the Registry. It starts automatically when you run `grapity serve`.

## Usage

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

## Dark mode

The Hub defaults to dark mode. Use the toggle in the header to switch between dark and light themes.

## See also

- [Spec detail page](/platform/hub/spec-detail) — Explore endpoints, changelog, versions, and raw spec
- [grapity serve](/cli-reference/serve) — Start the Hub alongside the Registry
- [grapity registry push](/cli-reference/registry) — Push specs so they appear in the Hub
- [CLI Reference: grapity materialize](/cli-reference/materialize) — Pull specs into a repository
