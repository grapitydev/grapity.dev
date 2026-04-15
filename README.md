# grapity.dev

Landing page for [grapity.dev](https://grapity.dev).

## Local development

Open `index.html` in a browser. No build step needed. The site uses Tailwind CSS via CDN, Google Fonts, and custom CSS.

## Deployment

This site is deployed via GitHub Pages from the `main` branch of this repository.

### Custom domain setup

1. In this repo, the `CNAME` file contains `grapity.dev`
2. In GitHub repo Settings > Pages, set the custom domain to `grapity.dev`
3. In your DNS registrar, configure:
   - **A records** pointing to GitHub Pages IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - **CNAME record**: `grapity.dev` -> `grapitydev.github.io`

### Enforce HTTPS

After DNS propagates, enable "Enforce HTTPS" in GitHub Pages settings.

## Tech stack

- Static HTML + Tailwind CSS (CDN)
- Google Fonts: Space Grotesk, Inter, JetBrains Mono
- No build step, no Node.js, no framework