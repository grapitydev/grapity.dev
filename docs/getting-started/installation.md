# Installation

Choose the method that fits your environment.

## Homebrew (macOS and Linux)

```bash
brew install grapitydev/tap/grapity
```

## apt (Debian/Ubuntu)

```bash
curl -fsSL https://grapitydev.github.io/packages/gpg.key | sudo gpg --dearmor -o /usr/share/keyrings/grapity.gpg
echo "deb [signed-by=/usr/share/keyrings/grapity.gpg] https://grapitydev.github.io/packages/apt stable main" | sudo tee /etc/apt/sources.list.d/grapity.list
sudo apt update && sudo apt install grapity
```

## dnf (Fedora/RHEL)

```bash
sudo dnf config-manager addrepo --from-repofile=https://grapitydev.github.io/packages/dnf/grapity.repo
sudo dnf install grapity
```

## pacman (Arch)

Append to `/etc/pacman.conf`:

```ini
[grapity]
SigLevel = Required DatabaseOptional
Server = https://grapitydev.github.io/packages/pacman/$arch
```

Then trust the release key and install:

```bash
curl -fsSL https://grapitydev.github.io/packages/gpg.key | sudo pacman-key --add -
sudo pacman-key --lsign-key contact@grapity.dev
sudo pacman -Sy grapity
```

## npm

Install the Grapity CLI globally (requires Node.js 20+):

```bash
npm install -g @grapity/grapity
```

## From source

Clone the repository and build:

```bash
git clone https://github.com/grapitydev/grapity.git
cd grapity
bun install
bun run build
```

## Verify

```bash
grapity --version
```

## Requirements

| Component | Minimum Version |
|-----------|----------------|
| Node.js   | 20+ (npm installs only; packaged binaries are self-contained) |
| Bun       | 1.3.5+ (source builds only) |
| SQLite    | 3 (local mode) |
| PostgreSQL| 14+ (production)|

## Next steps

- [Quickstart](/getting-started/quickstart) — Get running in five minutes
- [grapity init](/cli-reference/init) — Configure local or remote mode
