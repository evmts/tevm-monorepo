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
        link: "/get-started",
        items: [
          { text: "Home", link: "/" },
          { text: "Get started", link: "/get-started" },
          { text: "Api reference", link: "/reference/api" },
        ],
      },
      {
        text: "Guides",
        link: '/guide/best-practices',
        items: [
          { text: "Best practices", link: "/guide/best-practices" },
          { text: "Cheat codes", link: "/guide/cheat-codes" },
          { text: "Testing", link: "/guide/testing" },
          { text: "Usage with ethers", link: "/guide/ethers-usage" },
          { text: "Usage with viem", link: "/guide/viem-usage" },
          { text: "Writing solidity scripts", link: "/guide/scripting" },
        ],
      },
      {
        text: "Reference",
        link: "/reference/api",
        items: [
          { text: "Execute", link: "/reference/execute" },
          { text: "HttpFork", link: "/reference/http-fork" },
          { text: "PublicClient", link: "/reference/public-client" },
          { text: "WalletClient", link: "/reference/wallet-client" },
        ],
      },
      {
        text: "Plugin reference",
        items: [
          { text: "Forge", link: "/plugin-reference/forge" },
          { text: "Hardhat", link: "/plugin-reference/hardhat" },
          { text: "Rollup plugin", link: "/plugin-reference/rollup" },
          { text: "Typescript", link: "/plugin-reference/typescript" },
          { text: "Webpack", link: "/plugin-reference/webpack" },
        ]
      }
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/evmts/evmts-monorepo" },
      { icon: "twitter", link: "https://twitter.com/FUCORY" },
    ],
  },
});

