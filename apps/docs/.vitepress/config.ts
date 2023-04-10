import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "EVMts docs",
  description: "EVMts docs",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "API", link: "/reference/api" },
    ],

    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "home", link: "/" },
          { text: "get started", link: "/get-started" },
          { text: "api reference", link: "/reference/api" },
        ],
      },
      {
        text: "Guides",
        items: [
          { text: "cheat codes", link: "/guide/cheat-codes" },
          { text: "scripting", link: "/guides/scripting" },
        ],
      },
      {
        text: "Reference",
        items: [
          { text: "usage with viem contracts", link: "/reference/contract" },
          { text: "execute", link: "/reference/execute" },
          { text: "http-fork", link: "/reference/http-fork" },
          { text: "public-client", link: "/reference/public-client" },
          { text: "wallet-client", link: "/reference/wallet-client" },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/evmts/evmts-monorepo" },
      { icon: "twitter", link: "https://twitter.com/FUCORY" },
    ],
  },
});

