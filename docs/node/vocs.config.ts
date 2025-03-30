import { defineConfig } from "vocs";

export default defineConfig({
  title: "Tevm Node",
  titleTemplate: "%s · Tevm",
  baseUrl:
    process.env.VERCEL_ENV === "production"
      ? "https://node.tevm.sh"
      : process.env.VERCEL_URL,
  rootDir: ".",
  description:
    "A lightweight, unopinionated, powerful EVM node that runs in the browser",
  // Updated logo configuration
  logoUrl: {
    light: "/tevm-logo-light.png",
    dark: "/tevm-logo-dark.png",
  },
  iconUrl: "/tevm-logo.webp",
  // Configuring OG Image
  ogImageUrl:
    "https://vocs.dev/api/og?logo=%logo&title=%title&description=%description",
  // Set default font
  font: {
    google: "Inter",
  },
  // Enhance theme with accent color
  theme: {
    accentColor: "#0085FF",
    colorScheme: "system",
  },
  // Banner for important updates or announcements
  banner: {
    content:
      "🚀 Tevm Node is in Beta! Join our [Telegram community](https://t.me/+ANThR9bHDLAwMjUx)",
    dismissable: true,
    backgroundColor: "#e6f7ff",
  },
  // Improved top navigation
  topNav: [
    {
      text: "Docs",
      link: "/introduction/what-is-tevm-node",
      match: "/introduction",
    },
    {
      text: "Quick Start",
      link: "/getting-started/overview",
      match: "/getting-started",
    },
    { text: "Examples", link: "/examples/viem", match: "/examples" },
    {
      text: "Ecosystem",
      items: [
        { text: "Viem", link: "https://viem.sh/" },
        {
          text: "Ethereumjs",
          link: "https://github.com/ethereumjs/ethereumjs-monorepo",
        },
        { text: "Krome", link: "https://github.com/evmts/krome" },
      ],
    },
  ],
  sidebar: [
    {
      text: "Getting started",
      collapsed: false,
      items: [
        { text: "Overview", link: "/getting-started/overview" },
        {
          text: "Why Run Ethereum in JS?",
          link: "/introduction/why-run-ethereum-in-js",
        },
        { text: "Getting started with Viem", link: "/getting-started/viem" },
        {
          text: "Getting started with Ethers",
          link: "/getting-started/ethers",
        },
        { text: "Bundler Quickstart", link: "/getting-started/bundler" },
        { text: "CLI Quickstart", link: "/getting-started/cli" },
        { text: "What is Tevm Node?", link: "/introduction/what-is-tevm-node" },
        {
          text: "Architecture Overview",
          link: "/introduction/architecture-overview",
        },
        {
          text: "Community & Testimonials",
          link: "/getting-started/testimonials",
        },
      ],
    },
    {
      text: "Tevm guides",
      collapsed: true,
      items: [
        { text: "Creating a Node", link: "/core/create-tevm-node" },
        { text: "Using with Viem", link: "/examples/viem" },
        { text: "Using with Ethers", link: "/examples/ethers" },
        { text: "Forking & Reforking", link: "/core/forking" },
        { text: "Managing State", link: "/core/managing-state" },
        { text: "Mining Modes", link: "/core/mining-modes" },
        { text: "Account Management", link: "/api/account-management" },
        { text: "EVM Events", link: "/api/evm-events" },
        { text: "JSON-RPC", link: "/api/json-rpc" },
        { text: "Methods Overview", link: "/api/methods" },
        { text: "Package Overview", link: "/api/packages" },
        { text: "Call API", link: "/api/tevm-call" },
        { text: "VM and Submodules", link: "/api/vm-and-submodules" },
        { text: "Decorators", link: "/api/decorators" },
        {
          text: "Custom Precompiles (advanced)",
          link: "/advanced/custom-precompiles",
        },
        { text: "TevmNode (advanced)", link: "/core/tevm-node-interface" },
      ],
    },
    {
      text: "Reference",
      collapsed: true,
      items: [
        {
          text: "Core Packages",
          collapsed: true,
          items: [
            { text: "Actions (@tevm/actions)", link: "/reference/actions" },
            { text: "Virtual Machine (@tevm/vm)", link: "/reference/vm" },
            {
              text: "State Management (@tevm/state)",
              link: "/reference/state",
            },
            {
              text: "Blockchain (@tevm/blockchain)",
              link: "/reference/blockchain",
            },
            { text: "EVM (@tevm/evm)", link: "/reference/evm" },
          ],
        },
        {
          text: "Transaction & Block Packages",
          collapsed: true,
          items: [
            { text: "Block (@tevm/block)", link: "/reference/block" },
            { text: "Transactions (@tevm/tx)", link: "/reference/tx" },
            {
              text: "Transaction Pool (@tevm/txpool)",
              link: "/reference/txpool",
            },
            {
              text: "Receipt Manager (@tevm/receipt-manager)",
              link: "/reference/receipt-manager",
            },
          ],
        },
        {
          text: "Client & Communication",
          collapsed: true,
          items: [
            {
              text: "CLI (tevm)",
              link: "/reference/cli",
            },
            {
              text: "Memory Client (@tevm/memory-client)",
              link: "/reference/memory-client",
            },
            { text: "HTTP Client (@tevm/http-client)", link: "/api/json-rpc" },
            { text: "JSON-RPC (@tevm/jsonrpc)", link: "/api/json-rpc" },
            { text: "Server (@tevm/server)", link: "/reference/server" },
          ],
        },
        {
          text: "Smart Contract Tools",
          collapsed: true,
          items: [
            { text: "Contract (@tevm/contract)", link: "/reference/contract" },
            {
              text: "Contract Bundler",
              link: "/reference/bundler",
              items: [
                { text: "Overview", link: "/reference/bundler/overview" },
                { text: "Internals", link: "/reference/bundler/internals" },
                {
                  text: "Methods & Exports",
                  link: "/reference/bundler/methods",
                },
                {
                  text: "Troubleshooting",
                  link: "/reference/bundler/troubleshooting",
                },
                { text: "Contract Loader", link: "/api/whatsabi-integration" },
              ],
            },
            {
              text: "Precompiles (@tevm/precompiles)",
              link: "/advanced/custom-precompiles",
            },
            {
              text: "Predeploys (@tevm/predeploys)",
              link: "/advanced/custom-precompiles",
            },
          ],
        },
        {
          text: "Utilities & Helpers",
          collapsed: true,
          items: [
            { text: "Utils (@tevm/utils)", link: "/reference/utils" },
            { text: "Common (@tevm/common)", link: "/reference/common" },
            {
              text: "Decorators (@tevm/decorators)",
              link: "/reference/decorators",
            },
            { text: "Procedures (@tevm/procedures)", link: "/api/methods" },
            { text: "RLP (@tevm/rlp)", link: "/reference/rlp" },
            { text: "Trie (@tevm/trie)", link: "/reference/trie" },
            { text: "Address (@tevm/address)", link: "/reference/address" },
          ],
        },
      ],
    },
    {
      text: "Integration Examples",
      collapsed: true,
      items: [
        { text: "Local Testing Flow", link: "/examples/local-testing" },
        { text: "Forking Mainnet", link: "/examples/forking-mainnet" },
        { text: "Building a Debugger UI", link: "/examples/debugger-ui" },
      ],
    },
  ],
  editLink: {
    pattern:
      "https://github.com/evmts/tevm-monorepo/edit/main/docs/node/docs/pages/:path",
    text: "Edit this page on GitHub",
  },
  // Enable search with boosting for important pages
  search: {
    boostDocument(documentId) {
      if (
        documentId.includes("getting-started") ||
        documentId.includes("overview")
      ) {
        return 2;
      }
      return 1;
    },
  },
  socials: [
    {
      icon: "github",
      link: "https://github.com/evmts/tevm-monorepo",
      label: "Github",
    },
    {
      icon: "telegram",
      link: "https://t.me/+ANThR9bHDLAwMjUx",
      label: "Telegram",
    },
    {
      icon: "x",
      link: "https://x.com/tevmtools",
      label: "Twitter",
    },
    {
      icon: "discord",
      link: "https://discord.gg/tevm",
      label: "Discord",
    },
  ],
  // Configure code highlighting
  markdown: {
    code: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
});
