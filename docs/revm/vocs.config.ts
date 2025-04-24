import { defineConfig } from "vocs";

export default defineConfig({
  title: "REVM Docs",
  titleTemplate: "%s · Tevm",
  baseUrl:
    process.env.VERCEL_ENV === "production"
      ? "https://revm.tevm.sh"
      : process.env.VERCEL_URL,
  rootDir: ".",
  description:
    "Comprehensive documentation for REVM - the Rust EVM implementation used by Tevm",
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
      "🚀 REVM Documentation is in Beta! Join our [Telegram community](https://t.me/+ANThR9bHDLAwMjUx)",
    dismissable: true,
    backgroundColor: "#e6f7ff",
  },
  // Improved top navigation
  topNav: [
    {
      text: "Docs",
      link: "/introduction",
      match: "/introduction",
    },
    {
      text: "Beginner Tutorial",
      link: "/beginner-tutorial",
      match: "/beginner-tutorial",
    },
    { 
      text: "Examples", 
      link: "/examples", 
      match: "/examples" 
    },
    {
      text: "Ecosystem",
      items: [
        { text: "Tevm", link: "https://tevm.sh/" },
        { text: "Viem", link: "https://viem.sh/" },
        {
          text: "Ethereumjs",
          link: "https://github.com/ethereumjs/ethereumjs-monorepo",
        },
      ],
    },
  ],
  sidebar: [
    {
      text: "Introduction",
      link: "/introduction",
    },
    {
      text: "Beginner Tutorial",
      collapsed: false,
      items: [
        { text: "Introduction to REVM", link: "/beginner-tutorial/introduction-to-revm" },
        { text: "Getting Started", link: "/beginner-tutorial/getting-started" },
        { text: "Basic Transaction Execution", link: "/beginner-tutorial/basic-transaction-execution" },
        { text: "Smart Contract Deployment", link: "/beginner-tutorial/smart-contract-deployment" },
        { text: "State Management", link: "/beginner-tutorial/state-management" },
        { text: "Next Steps", link: "/beginner-tutorial/next-steps" },
      ],
    },
    {
      text: "Intermediate Concepts",
      collapsed: false,
      items: [
        { text: "REVM Architecture", link: "/intermediate-concepts/revm-architecture" },
        { text: "EVM Execution Model", link: "/intermediate-concepts/evm-execution-model" },
        { text: "State and Storage", link: "/intermediate-concepts/state-and-storage" },
        { text: "Transaction Processing", link: "/intermediate-concepts/transaction-processing" },
        { text: "Block Processing", link: "/intermediate-concepts/block-processing" },
        { text: "EVM Customization", link: "/intermediate-concepts/evm-customization" },
        { text: "Performance Considerations", link: "/intermediate-concepts/performance-considerations" },
        { text: "Integration Patterns", link: "/intermediate-concepts/integration-patterns" },
      ],
    },
    {
      text: "Examples",
      collapsed: false,
      items: [
        { text: "Basic Transaction Processing", link: "/examples/basic-transaction-processing" },
        { text: "Contract Deployment & Interaction", link: "/examples/contract-deployment-interaction" },
        { text: "State Manipulation", link: "/examples/state-manipulation" },
        { text: "Gas Profiling", link: "/examples/gas-profiling" },
        { text: "Tracing & Debugging", link: "/examples/tracing-debugging" },
        { text: "Block Explorer", link: "/examples/block-explorer" },
        { text: "Forking Network", link: "/examples/forking-network" },
        { text: "JSON-RPC API", link: "/examples/json-rpc-api" },
      ],
    },
    {
      text: "Expert Reference",
      collapsed: true,
      items: [
        { text: "API Reference", link: "/expert-reference/api-reference" },
        { text: "Core Traits and Interfaces", link: "/expert-reference/core-traits-and-interfaces" },
        { text: "Context Components", link: "/expert-reference/context-components" },
        { text: "Instruction Set", link: "/expert-reference/instruction-set" },
        { text: "Precompiled Contracts", link: "/expert-reference/precompiled-contracts" },
        { text: "State Management", link: "/expert-reference/state-management" },
        { text: "Database Components", link: "/expert-reference/database-components" },
        { text: "Inspection System", link: "/expert-reference/inspection-system" },
        { text: "No-STD Compatibility", link: "/expert-reference/no-std-compatibility" },
      ],
    },
  ],
  editLink: {
    pattern:
      "https://github.com/evmts/tevm-monorepo/edit/main/docs/revm/pages/:path",
    text: "Edit this page on GitHub",
  },
  // Enable search with boosting for important pages
  search: {
    boostDocument(documentId) {
      if (
        documentId.includes("introduction") ||
        documentId.includes("beginner-tutorial")
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