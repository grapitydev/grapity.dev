# Installation

Choose the method that fits your environment.

## npm (recommended)

Install all three packages globally:

```bash
npm install -g @grapity/cli @grapity/registry @grapity/hub
```

Verify the installation:

```bash
grapity --version
```

## Bun

If you use Bun as your runtime:

```bash
bun add -g @grapity/cli @grapity/registry @grapity/hub
```

## Docker

Run the Registry without installing anything locally:

```bash
docker run --rm -p 3750:3750 grapity/registry:latest
```

::: tip
The Docker image includes only the Registry. For the Hub and CLI, install the npm packages locally or use a multi-service compose setup.
:::

## From source

Clone the repository and build:

```bash
git clone https://github.com/grapitydev/grapity.git
cd grapity
bun install
bun run build
```

## Requirements

| Component | Minimum Version |
|-----------|----------------|
| Node.js   | 20+            |
| Bun       | 1.3.5+         |
| SQLite    | 3 (local mode) |
| PostgreSQL| 14+ (production)|

## Next steps

- [Quickstart](/getting-started/quickstart) — Get running in five minutes
- [grapity init](/cli-reference/init) — Configure local or remote mode
