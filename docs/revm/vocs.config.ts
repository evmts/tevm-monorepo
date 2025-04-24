import { defineConfig } from "vocs";

export default defineConfig({
  title: "REVM Documentation",
  titleTemplate: "%s · REVM",
  baseUrl:
    process.env.VERCEL_ENV === "production"
      ? "https://revm.tevm.sh"
      : process.env.VERCEL_URL,
  rootDir: ".",
  description:
    "Comprehensive documentation for REVM - a high-performance Rust Ethereum Virtual Machine",
  
  // Logo configuration
  logoUrl: {
    light: "/tevm-logo-light.png",
    dark: "/tevm-logo-dark.png",
  },
  iconUrl: "/tevm-logo.webp",
  
  // Configure OG image
  ogImageUrl:
    "https://vocs.dev/api/og?logo=%logo&title=%title&description=%description",
  
  // Font configuration
  font: {
    google: "Inter",
  },
  
  // Theme customization
  theme: {
    accentColor: "#0085FF",
    colorScheme: "system",
  },
  
  // Announcement banner
  banner: {
    content:
      "🦀 Welcome to the REVM documentation! Join our [Telegram community](https://t.me/+ANThR9bHDLAwMjUx) for updates and discussion.",
    dismissable: true,
    backgroundColor: "#e6f7ff",
  },
  
  // Enhanced top navigation with improved structure
  topNav: [
    {
      text: "Home",
      link: "/",
      match: "^/$",
    },
    {
      text: "Introduction",
      link: "/introduction",
      match: "/introduction",
    },
    {
      text: "Tutorials",
      items: [
        { 
          text: "Beginner Tutorial", 
          link: "/beginner-tutorial/introduction-to-revm"
        },
        { 
          text: "Example Projects", 
          link: "/examples/basic-transaction-processing" 
        },
      ],
    },
    {
      text: "Reference",
      items: [
        { 
          text: "Architecture", 
          link: "/intermediate-concepts/revm-architecture"
        },
        { 
          text: "API Reference", 
          link: "/expert-reference/api-reference"
        },
        { 
          text: "Precompiles", 
          link: "/expert-reference/precompiled-contracts"
        },
      ],
    },
    {
      text: "Ecosystem",
      items: [
        { text: "Tevm", link: "https://tevm.sh/" },
        { text: "Rust Ethereum", link: "https://github.com/rust-ethereum" },
        { text: "REVM Repository", link: "https://github.com/bluealloy/revm" },
      ],
    },
  ],
  
  // Enhanced sidebar with improved structure and organization
  sidebar: [
    {
      text: "Getting Started",
      items: [
        { text: "Introduction", link: "/introduction" },
        { text: "Quick Installation", link: "/beginner-tutorial/getting-started" },
      ]
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
      text: "Core Concepts",
      collapsed: false,
      items: [
        { text: "REVM Architecture", link: "/intermediate-concepts/revm-architecture" },
        { text: "EVM Execution Model", link: "/intermediate-concepts/evm-execution-model" },
        { text: "State and Storage", link: "/intermediate-concepts/state-and-storage" },
        { text: "Transaction Processing", link: "/intermediate-concepts/transaction-processing" },
        { text: "Block Processing", link: "/intermediate-concepts/block-processing" },
        { text: "EVM Customization", link: "/intermediate-concepts/evm-customization" },
        { text: "Performance", link: "/intermediate-concepts/performance-considerations" },
        { text: "Integration Patterns", link: "/intermediate-concepts/integration-patterns" },
      ],
    },
    {
      text: "Example Projects",
      collapsed: true,
      items: [
        { text: "Basic Transaction Processing", link: "/examples/basic-transaction-processing" },
        { text: "Contract Deployment", link: "/examples/contract-deployment-interaction" },
        { text: "State Manipulation", link: "/examples/state-manipulation" },
        { text: "Gas Profiling", link: "/examples/gas-profiling" },
        { text: "Tracing & Debugging", link: "/examples/tracing-debugging" },
        { text: "Block Explorer", link: "/examples/block-explorer" },
        { text: "Forking Network", link: "/examples/forking-network" },
        { text: "JSON-RPC API", link: "/examples/json-rpc-api" },
      ],
    },
    {
      text: "Technical Reference",
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
  
  // GitHub edit link
  editLink: {
    pattern:
      "https://github.com/evmts/tevm-monorepo/edit/main/docs/revm/pages/:path",
    text: "Edit this page on GitHub",
  },
  
  // Enhanced search with intelligent boosting
  search: {
    boostDocument(documentId) {
      if (documentId.includes("introduction")) {
        return 3;  // Highest boost for introduction pages
      }
      if (documentId.includes("beginner-tutorial")) {
        return 2;  // High boost for beginner content
      }
      if (documentId.includes("examples")) {
        return 1.5;  // Medium boost for examples
      }
      return 1;  // Default boost
    },
  },
  
  // Social links
  socials: [
    {
      icon: "github",
      link: "https://github.com/bluealloy/revm",
      label: "REVM on GitHub",
    },
    {
      icon: "telegram",
      link: "https://t.me/+ANThR9bHDLAwMjUx",
      label: "Telegram",
    },
    {
      icon: "discord",
      link: "https://discord.gg/CBwFyGH",
      label: "Discord",
    },
  ],
  
  // Enhanced code highlighting with better themes
  markdown: {
    code: {
      themes: {
        light: "github-light",
        dark: "one-dark-pro",
      },
      langs: [
        'rust',
        'typescript',
        'javascript',
        'solidity',
        'json',
        'bash',
        'toml',
        'yaml',
      ],
    },
    remarkPlugins: [
      // Any additional plugins can be added here
    ],
  },
  
  // Advanced page customization
  extendFrontmatter(frontmatter, filename) {
    // Add authors to certain sections automatically
    if (filename.includes('/expert-reference/')) {
      return {
        ...frontmatter,
        authors: frontmatter.authors || ['REVM Team'],
      };
    }
    return frontmatter;
  },
});