# Installation

Choose the method that fits your environment.

## npm (recommended)

Install the Grapity CLI globally:

```bash
npm install -g @grapity/grapity
```

Verify the installation:

```bash
grapity --version
```

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
