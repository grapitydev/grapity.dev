# Quickstart

Get Grapity running in under five minutes.

## What you will do

1. Install the Grapity CLI
2. Initialize local configuration
3. Start the Registry and Hub
4. Push your first API spec
5. Browse it in the Hub

## Prerequisites

- **Node.js** 20+ or **Bun** 1.3.5+
- One OpenAPI or AsyncAPI spec file (or use the example below)

## 1. Install the CLI

::: code-group

```bash [npm]
npm install -g @grapity/cli @grapity/registry @grapity/hub
```

```bash [bun]
bun add -g @grapity/cli @grapity/registry @grapity/hub
```

:::

## 2. Initialize local mode

```bash
grapity init --local
```

This creates `~/.grapity/config.yaml` with default settings:

```yaml
mode: local
local:
  port: 3750
  sqlitePath: ~/.grapity/registry.db
```

## 3. Start both servers

```bash
grapity serve
```

You will see:

```text
● Registry ready  ·  http://localhost:3750
● Hub ready     ·  http://localhost:3000
```

The Registry stores and validates specs. The Hub is the developer portal.

## 4. Push your first spec

Create a minimal OpenAPI file named `openapi.yaml`:

```yaml
openapi: "3.1.0"
info:
  title: Payments API
  version: "1.0.0"
paths:
  /v1/payments:
    get:
      summary: List payments
      responses:
        "200":
          description: OK
```

Then push it:

```bash
grapity registry push ./openapi.yaml --name payments-api
```

You will see:

```text
✓ Spec validated
✓ Backward compatibility: 0 breaking, 0 safe changes
✓ Version 1.0.0 registered
```

## 5. Browse the Hub

Open http://localhost:3000 in your browser.

You will see `payments-api` in the spec list. Click it to explore endpoints, view the compatibility report, and compare versions.

## Next steps

- [Installation options](/getting-started/installation) — Docker, PostgreSQL, and remote mode
- [Backward Compatibility](/platform/architecture/backward-compatibility) — Learn what changes are blocked and why
- [CLI Reference](/cli-reference/init) — Explore all commands
