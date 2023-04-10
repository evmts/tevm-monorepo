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
          { text: "Home", link: "/" },
          { text: "Get started", link: "/get-started" },
          { text: "Api reference", link: "/reference/api" },
        ],
      },
      {
        text: "Guides",
        items: [
          { text: "Cheat codes", link: "/guide/cheat-codes" },
          { text: "Scripting", link: "/guides/scripting" },
        ],
      },
      {
        text: "Reference",
        items: [
          { text: "Usage with viem", link: "/reference/contract" },
          { text: "Execute scripts", link: "/reference/execute" },
          { text: "Create fork", link: "/reference/http-fork" },
          { text: "Public client", link: "/reference/public-client" },
          { text: "Wallet client", link: "/reference/wallet-client" },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/evmts/evmts-monorepo" },
      { icon: "twitter", link: "https://twitter.com/FUCORY" },
    ],
  },
});

