import { defineConfig } from "vitepress";

export default defineConfig({
  title: "grapity docs",
  description: "Documentation for Grapity — the API contract guardian",
  base: "/docs/",
  outDir: "../dist/docs",
  srcDir: ".",
  cleanUrls: true,

  lastUpdated: true,

  ignoreDeadLinks: [
    /^http:\/\/localhost/,
  ],

  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/assets/favicon.svg" }],
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    [
      "link",
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    ],
    [
      "link",
      {
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
        rel: "stylesheet",
      },
    ],
  ],

  themeConfig: {
    siteTitle: false,

    nav: [
      { text: "Getting Started", link: "/getting-started/quickstart" },
      { text: "Platform", link: "/platform/" },
      { text: "CLI Reference", link: "/cli-reference/init" },
    ],

    sidebar: {
      "/getting-started/": [
        {
          text: "Getting Started",
          items: [
            { text: "Quickstart", link: "/getting-started/quickstart" },
            { text: "Installation", link: "/getting-started/installation" },
          ],
        },
      ],
      "/platform/": [
        {
          text: "Platform",
          items: [
            { text: "Overview", link: "/platform/" },
            {
              text: "Architecture",
              items: [
                {
                  text: "Backward Compatibility",
                  link: "/platform/architecture/backward-compatibility",
                },
                {
                  text: "Semver & Versioning",
                  link: "/platform/architecture/semver-and-versioning",
                },
                {
                  text: "Deprecation & Grace",
                  link: "/platform/architecture/deprecation-and-grace",
                },
              ],
            },
            {
              text: "Registry",
              items: [
                { text: "Overview", link: "/platform/registry/overview" },
              ],
            },
            {
              text: "Hub",
              items: [
                { text: "Using the Hub", link: "/platform/hub/using-the-hub" },
              ],
            },
            {
              text: "Gateway",
              items: [
                { text: "Overview", link: "/platform/gateway/overview" },
              ],
            },
          ],
        },
      ],
      "/cli-reference/": [
        {
          text: "CLI Reference",
          items: [
            { text: "grapity init", link: "/cli-reference/init" },
            { text: "grapity serve", link: "/cli-reference/serve" },
            { text: "grapity registry", link: "/cli-reference/registry" },
            { text: "grapity gateway", link: "/cli-reference/gateway" },
          ],
        },
      ],
    },

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/grapitydev",
      },
    ],

    search: {
      provider: "local",
    },

    editLink: {
      pattern:
        "https://github.com/grapitydev/grapity.dev/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },

    footer: {
      message: "Released under the Apache 2.0 License.",
      copyright: "Copyright 2026 Grapity",
    },
  },

  markdown: {
    theme: {
      dark: "catppuccin-mocha",
      light: "catppuccin-latte",
    },
  },
});
