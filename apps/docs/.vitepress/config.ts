import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "EVMts docs",
  description: "EVMts docs",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "API", link: "/api" },
    ],

    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Home", link: "/" },
          { text: "Get started", link: "/get-started" },
          { text: "Api reference", link: "/api" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/evmts/evmts-monorepo" },
    ],
  },
});

