# Installation

Choose the method that fits your environment.

## Quick install (recommended)

macOS and Linux:

```bash
curl -fsSL https://packages.grapity.dev/install.sh | sh
```

The installer detects your OS and package manager and installs through it, so updates arrive via normal system upgrades:

| Environment | What happens |
|---|---|
| macOS with Homebrew | `brew install grapitydev/tap/grapity` |
| macOS without Homebrew | Checksum-verified binary into `/usr/local/bin` |
| Debian/Ubuntu (apt) | Adds the signed grapity apt repo, installs `grapity` |
| Fedora/RHEL (dnf) | Adds the signed grapity dnf repo, installs `grapity` |
| Arch (pacman) | Adds the signed grapity pacman repo, installs `grapity` |
| Other Linux | Checksum-verified binary into `/usr/local/bin` (or `~/.local/bin` without sudo) |
| Windows | Not supported by the script — use [npm](#npm) or run it inside WSL |

To review the script before running it:

```bash
curl -fsSL https://packages.grapity.dev/install.sh -o install.sh
less install.sh
sh install.sh
```

Overrides: `GRAPITY_VERSION=v0.10.0` (pin a version), `GRAPITY_BIN_DIR=~/.local/bin` (binary install location), `GRAPITY_FORCE_BINARY=1` (skip package managers).

## Homebrew (macOS and Linux)

```bash
brew install grapitydev/tap/grapity
```

## Manual repository setup

The methods below configure the same signed repositories the installer uses, step by step.

### apt (Debian/Ubuntu)

```bash
curl -fsSL https://packages.grapity.dev/gpg.key | sudo gpg --dearmor -o /usr/share/keyrings/grapity.gpg
echo "deb [signed-by=/usr/share/keyrings/grapity.gpg] https://packages.grapity.dev/apt stable main" | sudo tee /etc/apt/sources.list.d/grapity.list
sudo apt update && sudo apt install grapity
```

### dnf (Fedora/RHEL)

```bash
sudo dnf config-manager addrepo --from-repofile=https://packages.grapity.dev/dnf/grapity.repo
sudo dnf install grapity
```

### pacman (Arch)

Append to `/etc/pacman.conf`:

```ini
[grapity]
SigLevel = Required DatabaseOptional
Server = https://packages.grapity.dev/pacman/$arch
```

Then trust the release key and install:

```bash
curl -fsSL https://packages.grapity.dev/gpg.key | sudo pacman-key --add -
sudo pacman-key --lsign-key contact@grapity.dev
sudo pacman -Sy grapity
```

## npm

Install the Grapity CLI globally (requires Node.js 20+):

```bash
npm install -g @grapity/grapity
```

## Direct binary

Download a self-contained binary from [GitHub Releases](https://github.com/grapitydev/grapity/releases) (`grapity-darwin-arm64`, `grapity-darwin-x64`, `grapity-linux-x64`, `grapity-linux-arm64`) and put it on your `PATH`:

```bash
curl -fsSL https://github.com/grapitydev/grapity/releases/latest/download/grapity-darwin-arm64 -o grapity
chmod +x grapity
sudo mv grapity /usr/local/bin/
```

No update channel with this method; download again to upgrade.

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
