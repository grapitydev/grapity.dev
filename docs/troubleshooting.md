# Troubleshooting

Common issues and how to resolve them.

## Push blocked with `409 breaking_change`

**Error:**

```text
breaking_change
Breaking changes detected. Use force: true with a reason to override, or declare an explicit major version.
```

**Cause:** Your spec contains changes that break backward compatibility with the previous version.

**Fix options:**

1. **Fix the spec** — restore removed fields, keep endpoints, or widen enums
2. **Declare a major release** — `grapity registry push ./spec.yaml --name api --version 2.0.0`
3. **Force push** — `grapity registry push ./spec.yaml --name api --force --reason "your reason"`

See [Backward Compatibility](/platform/architecture/backward-compatibility) for the full list of blocked and safe changes.

---

## `grapity init` complains about missing `--url`

**Error:**

```text
missing flag
--url is required for remote mode.
```

**Cause:** You passed `--remote` without `--url`.

**Fix:**

```bash
grapity init --remote --url https://api.grapity.dev --api-key YOUR_KEY
```

---

## Hub shows "index.html not found"

**Error:**

```text
index.html not found. Build the project with 'bun run build' first.
```

**Cause:** The Hub production assets were not built. `hub/serve` serves files from `dist/hub/`, which does not exist.

**Fix:**

```bash
cd node_modules/@grapity/grapity
bun install
bun run build
```

Or install from source with the build step included.

---

## Spec not found after push

**Error:**

```text
not_found
Spec "payments-api" not found
```

**Cause:**

1. You are talking to a different Registry than the one you pushed to (check `~/.grapity/config.yaml`)
2. The push failed and the spec was never created
3. You are using the wrong spec name (names are case-sensitive)

**Fix:**

```bash
# Verify your config
cat ~/.grapity/config.yaml

# List all specs to confirm the name
grapity registry list
```

---

## SQLite database is locked

**Error:**

```text
database is locked
```

**Cause:** Another process is using the SQLite database file. This happens if you started `grapity serve` twice, or if another tool has the file open.

**Fix:**

```bash
# Find and kill the other process
lsof ~/.grapity/registry.db
kill <PID>

# Or use a different database file
grapity serve --db /tmp/grapity-test.db
```

---

## Getting help

If your issue is not listed here:

1. Check the [GitHub Issues](https://github.com/grapitydev/grapity/issues) for similar reports
2. Run the command with `--help` for usage details
3. Check the [CLI Reference](/cli-reference/init) and [Architecture](/platform/architecture/backward-compatibility) docs
