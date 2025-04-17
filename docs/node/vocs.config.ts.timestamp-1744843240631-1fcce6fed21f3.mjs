// vocs.config.ts
import { defineConfig } from "file:///Users/williamcory/tevm/main/node_modules/.pnpm/vocs@1.0.0-alpha.62_@types+node@22.13.10_@types+react-dom@18.3.5_@types+react@18.3.18___2bd3f87bc2ffb18b322066c9add83ba5/node_modules/vocs/_lib/index.js";
var vocs_config_default = defineConfig({
  title: "Tevm Node",
  titleTemplate: "%s \xB7 Tevm",
  baseUrl: process.env.VERCEL_ENV === "production" ? "https://node.tevm.sh" : process.env.VERCEL_URL,
  rootDir: ".",
  description: "A lightweight, unopinionated, powerful EVM node that runs in the browser",
  // Updated logo configuration
  logoUrl: {
    light: "/tevm-logo-light.png",
    dark: "/tevm-logo-dark.png"
  },
  iconUrl: "/tevm-logo.webp",
  // Configuring OG Image
  ogImageUrl: "https://vocs.dev/api/og?logo=%logo&title=%title&description=%description",
  // Set default font
  font: {
    google: "Inter"
  },
  // Enhance theme with accent color
  theme: {
    accentColor: "#0085FF",
    colorScheme: "system"
  },
  // Banner for important updates or announcements
  banner: {
    content: "\u{1F680} Tevm Node is in Beta! Join our [Telegram community](https://t.me/+ANThR9bHDLAwMjUx)",
    dismissable: true,
    backgroundColor: "#e6f7ff"
  },
  // Improved top navigation
  topNav: [
    {
      text: "Docs",
      link: "/introduction/what-is-tevm-node",
      match: "/introduction"
    },
    {
      text: "Quick Start",
      link: "/getting-started/overview",
      match: "/getting-started"
    },
    { text: "Examples", link: "/examples/viem", match: "/examples" },
    {
      text: "Ecosystem",
      items: [
        { text: "Viem", link: "https://viem.sh/" },
        {
          text: "Ethereumjs",
          link: "https://github.com/ethereumjs/ethereumjs-monorepo"
        },
        { text: "Krome", link: "https://github.com/evmts/krome" }
      ]
    }
  ],
  sidebar: [
    {
      text: "Getting started",
      collapsed: false,
      items: [
        { text: "Overview", link: "/getting-started/overview" },
        {
          text: "Why Run Ethereum in JS?",
          link: "/introduction/why-run-ethereum-in-js"
        },
        { text: "Getting started with Viem", link: "/getting-started/viem" },
        {
          text: "Getting started with Ethers",
          link: "/getting-started/ethers"
        },
        { text: "Bundler Quickstart", link: "/getting-started/bundler" },
        { text: "CLI Quickstart", link: "/getting-started/cli" },
        { text: "What is Tevm Node?", link: "/introduction/what-is-tevm-node" },
        {
          text: "Architecture Overview",
          link: "/introduction/architecture-overview"
        },
        {
          text: "Community & Testimonials",
          link: "/getting-started/testimonials"
        }
      ]
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
          link: "/advanced/custom-precompiles"
        },
        { text: "TevmNode (advanced)", link: "/core/tevm-node-interface" }
      ]
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
              link: "/reference/state"
            },
            {
              text: "Blockchain (@tevm/blockchain)",
              link: "/reference/blockchain"
            },
            { text: "EVM (@tevm/evm)", link: "/reference/evm" }
          ]
        },
        {
          text: "Transaction & Block Packages",
          collapsed: true,
          items: [
            { text: "Block (@tevm/block)", link: "/reference/block" },
            { text: "Transactions (@tevm/tx)", link: "/reference/tx" },
            {
              text: "Transaction Pool (@tevm/txpool)",
              link: "/reference/txpool"
            },
            {
              text: "Receipt Manager (@tevm/receipt-manager)",
              link: "/reference/receipt-manager"
            }
          ]
        },
        {
          text: "Client & Communication",
          collapsed: true,
          items: [
            {
              text: "CLI (tevm)",
              link: "/reference/cli"
            },
            {
              text: "Memory Client (@tevm/memory-client)",
              link: "/reference/memory-client"
            },
            { text: "HTTP Client (@tevm/http-client)", link: "/api/json-rpc" },
            { text: "JSON-RPC (@tevm/jsonrpc)", link: "/api/json-rpc" },
            { text: "Server (@tevm/server)", link: "/reference/server" }
          ]
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
                  link: "/reference/bundler/methods"
                },
                {
                  text: "Troubleshooting",
                  link: "/reference/bundler/troubleshooting"
                },
                { text: "Contract Loader", link: "/api/whatsabi-integration" }
              ]
            },
            {
              text: "Precompiles (@tevm/precompiles)",
              link: "/advanced/custom-precompiles"
            },
            {
              text: "Predeploys (@tevm/predeploys)",
              link: "/advanced/custom-precompiles"
            }
          ]
        },
        {
          text: "Utilities & Helpers",
          collapsed: true,
          items: [
            { text: "Utils (@tevm/utils)", link: "/reference/utils" },
            { text: "Common (@tevm/common)", link: "/reference/common" },
            {
              text: "Decorators (@tevm/decorators)",
              link: "/reference/decorators"
            },
            { text: "Procedures (@tevm/procedures)", link: "/api/methods" },
            { text: "RLP (@tevm/rlp)", link: "/reference/rlp" },
            { text: "Trie (@tevm/trie)", link: "/reference/trie" },
            { text: "Address (@tevm/address)", link: "/reference/address" }
          ]
        }
      ]
    },
    {
      text: "Integration Examples",
      collapsed: true,
      items: [
        { text: "Local Testing Flow", link: "/examples/local-testing" },
        { text: "Forking Mainnet", link: "/examples/forking-mainnet" },
        { text: "Building a Debugger UI", link: "/examples/debugger-ui" }
      ]
    }
  ],
  editLink: {
    pattern: "https://github.com/evmts/tevm-monorepo/edit/main/docs/node/docs/pages/:path",
    text: "Edit this page on GitHub"
  },
  // Enable search with boosting for important pages
  search: {
    boostDocument(documentId) {
      if (documentId.includes("getting-started") || documentId.includes("overview")) {
        return 2;
      }
      return 1;
    }
  },
  socials: [
    {
      icon: "github",
      link: "https://github.com/evmts/tevm-monorepo",
      label: "Github"
    },
    {
      icon: "telegram",
      link: "https://t.me/+ANThR9bHDLAwMjUx",
      label: "Telegram"
    },
    {
      icon: "x",
      link: "https://x.com/tevmtools",
      label: "Twitter"
    },
    {
      icon: "discord",
      link: "https://discord.gg/tevm",
      label: "Discord"
    }
  ],
  // Configure code highlighting
  markdown: {
    code: {
      themes: {
        light: "github-light",
        dark: "github-dark"
      }
    }
  }
});
export {
  vocs_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidm9jcy5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvd2lsbGlhbWNvcnkvdGV2bS9tYWluL2RvY3Mvbm9kZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3dpbGxpYW1jb3J5L3Rldm0vbWFpbi9kb2NzL25vZGUvdm9jcy5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3dpbGxpYW1jb3J5L3Rldm0vbWFpbi9kb2NzL25vZGUvdm9jcy5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidm9jc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICB0aXRsZTogXCJUZXZtIE5vZGVcIixcbiAgdGl0bGVUZW1wbGF0ZTogXCIlcyBcdTAwQjcgVGV2bVwiLFxuICBiYXNlVXJsOlxuICAgIHByb2Nlc3MuZW52LlZFUkNFTF9FTlYgPT09IFwicHJvZHVjdGlvblwiXG4gICAgICA/IFwiaHR0cHM6Ly9ub2RlLnRldm0uc2hcIlxuICAgICAgOiBwcm9jZXNzLmVudi5WRVJDRUxfVVJMLFxuICByb290RGlyOiBcIi5cIixcbiAgZGVzY3JpcHRpb246XG4gICAgXCJBIGxpZ2h0d2VpZ2h0LCB1bm9waW5pb25hdGVkLCBwb3dlcmZ1bCBFVk0gbm9kZSB0aGF0IHJ1bnMgaW4gdGhlIGJyb3dzZXJcIixcbiAgLy8gVXBkYXRlZCBsb2dvIGNvbmZpZ3VyYXRpb25cbiAgbG9nb1VybDoge1xuICAgIGxpZ2h0OiBcIi90ZXZtLWxvZ28tbGlnaHQucG5nXCIsXG4gICAgZGFyazogXCIvdGV2bS1sb2dvLWRhcmsucG5nXCIsXG4gIH0sXG4gIGljb25Vcmw6IFwiL3Rldm0tbG9nby53ZWJwXCIsXG4gIC8vIENvbmZpZ3VyaW5nIE9HIEltYWdlXG4gIG9nSW1hZ2VVcmw6XG4gICAgXCJodHRwczovL3ZvY3MuZGV2L2FwaS9vZz9sb2dvPSVsb2dvJnRpdGxlPSV0aXRsZSZkZXNjcmlwdGlvbj0lZGVzY3JpcHRpb25cIixcbiAgLy8gU2V0IGRlZmF1bHQgZm9udFxuICBmb250OiB7XG4gICAgZ29vZ2xlOiBcIkludGVyXCIsXG4gIH0sXG4gIC8vIEVuaGFuY2UgdGhlbWUgd2l0aCBhY2NlbnQgY29sb3JcbiAgdGhlbWU6IHtcbiAgICBhY2NlbnRDb2xvcjogXCIjMDA4NUZGXCIsXG4gICAgY29sb3JTY2hlbWU6IFwic3lzdGVtXCIsXG4gIH0sXG4gIC8vIEJhbm5lciBmb3IgaW1wb3J0YW50IHVwZGF0ZXMgb3IgYW5ub3VuY2VtZW50c1xuICBiYW5uZXI6IHtcbiAgICBjb250ZW50OlxuICAgICAgXCJcdUQ4M0RcdURFODAgVGV2bSBOb2RlIGlzIGluIEJldGEhIEpvaW4gb3VyIFtUZWxlZ3JhbSBjb21tdW5pdHldKGh0dHBzOi8vdC5tZS8rQU5UaFI5YkhETEF3TWpVeClcIixcbiAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiI2U2ZjdmZlwiLFxuICB9LFxuICAvLyBJbXByb3ZlZCB0b3AgbmF2aWdhdGlvblxuICB0b3BOYXY6IFtcbiAgICB7XG4gICAgICB0ZXh0OiBcIkRvY3NcIixcbiAgICAgIGxpbms6IFwiL2ludHJvZHVjdGlvbi93aGF0LWlzLXRldm0tbm9kZVwiLFxuICAgICAgbWF0Y2g6IFwiL2ludHJvZHVjdGlvblwiLFxuICAgIH0sXG4gICAge1xuICAgICAgdGV4dDogXCJRdWljayBTdGFydFwiLFxuICAgICAgbGluazogXCIvZ2V0dGluZy1zdGFydGVkL292ZXJ2aWV3XCIsXG4gICAgICBtYXRjaDogXCIvZ2V0dGluZy1zdGFydGVkXCIsXG4gICAgfSxcbiAgICB7IHRleHQ6IFwiRXhhbXBsZXNcIiwgbGluazogXCIvZXhhbXBsZXMvdmllbVwiLCBtYXRjaDogXCIvZXhhbXBsZXNcIiB9LFxuICAgIHtcbiAgICAgIHRleHQ6IFwiRWNvc3lzdGVtXCIsXG4gICAgICBpdGVtczogW1xuICAgICAgICB7IHRleHQ6IFwiVmllbVwiLCBsaW5rOiBcImh0dHBzOi8vdmllbS5zaC9cIiB9LFxuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogXCJFdGhlcmV1bWpzXCIsXG4gICAgICAgICAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vZXRoZXJldW1qcy9ldGhlcmV1bWpzLW1vbm9yZXBvXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHsgdGV4dDogXCJLcm9tZVwiLCBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9ldm10cy9rcm9tZVwiIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIF0sXG4gIHNpZGViYXI6IFtcbiAgICB7XG4gICAgICB0ZXh0OiBcIkdldHRpbmcgc3RhcnRlZFwiLFxuICAgICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHsgdGV4dDogXCJPdmVydmlld1wiLCBsaW5rOiBcIi9nZXR0aW5nLXN0YXJ0ZWQvb3ZlcnZpZXdcIiB9LFxuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogXCJXaHkgUnVuIEV0aGVyZXVtIGluIEpTP1wiLFxuICAgICAgICAgIGxpbms6IFwiL2ludHJvZHVjdGlvbi93aHktcnVuLWV0aGVyZXVtLWluLWpzXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHsgdGV4dDogXCJHZXR0aW5nIHN0YXJ0ZWQgd2l0aCBWaWVtXCIsIGxpbms6IFwiL2dldHRpbmctc3RhcnRlZC92aWVtXCIgfSxcbiAgICAgICAge1xuICAgICAgICAgIHRleHQ6IFwiR2V0dGluZyBzdGFydGVkIHdpdGggRXRoZXJzXCIsXG4gICAgICAgICAgbGluazogXCIvZ2V0dGluZy1zdGFydGVkL2V0aGVyc1wiLFxuICAgICAgICB9LFxuICAgICAgICB7IHRleHQ6IFwiQnVuZGxlciBRdWlja3N0YXJ0XCIsIGxpbms6IFwiL2dldHRpbmctc3RhcnRlZC9idW5kbGVyXCIgfSxcbiAgICAgICAgeyB0ZXh0OiBcIkNMSSBRdWlja3N0YXJ0XCIsIGxpbms6IFwiL2dldHRpbmctc3RhcnRlZC9jbGlcIiB9LFxuICAgICAgICB7IHRleHQ6IFwiV2hhdCBpcyBUZXZtIE5vZGU/XCIsIGxpbms6IFwiL2ludHJvZHVjdGlvbi93aGF0LWlzLXRldm0tbm9kZVwiIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0ZXh0OiBcIkFyY2hpdGVjdHVyZSBPdmVydmlld1wiLFxuICAgICAgICAgIGxpbms6IFwiL2ludHJvZHVjdGlvbi9hcmNoaXRlY3R1cmUtb3ZlcnZpZXdcIixcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHRleHQ6IFwiQ29tbXVuaXR5ICYgVGVzdGltb25pYWxzXCIsXG4gICAgICAgICAgbGluazogXCIvZ2V0dGluZy1zdGFydGVkL3Rlc3RpbW9uaWFsc1wiLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHRleHQ6IFwiVGV2bSBndWlkZXNcIixcbiAgICAgIGNvbGxhcHNlZDogdHJ1ZSxcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHsgdGV4dDogXCJDcmVhdGluZyBhIE5vZGVcIiwgbGluazogXCIvY29yZS9jcmVhdGUtdGV2bS1ub2RlXCIgfSxcbiAgICAgICAgeyB0ZXh0OiBcIlVzaW5nIHdpdGggVmllbVwiLCBsaW5rOiBcIi9leGFtcGxlcy92aWVtXCIgfSxcbiAgICAgICAgeyB0ZXh0OiBcIlVzaW5nIHdpdGggRXRoZXJzXCIsIGxpbms6IFwiL2V4YW1wbGVzL2V0aGVyc1wiIH0sXG4gICAgICAgIHsgdGV4dDogXCJGb3JraW5nICYgUmVmb3JraW5nXCIsIGxpbms6IFwiL2NvcmUvZm9ya2luZ1wiIH0sXG4gICAgICAgIHsgdGV4dDogXCJNYW5hZ2luZyBTdGF0ZVwiLCBsaW5rOiBcIi9jb3JlL21hbmFnaW5nLXN0YXRlXCIgfSxcbiAgICAgICAgeyB0ZXh0OiBcIk1pbmluZyBNb2Rlc1wiLCBsaW5rOiBcIi9jb3JlL21pbmluZy1tb2Rlc1wiIH0sXG4gICAgICAgIHsgdGV4dDogXCJBY2NvdW50IE1hbmFnZW1lbnRcIiwgbGluazogXCIvYXBpL2FjY291bnQtbWFuYWdlbWVudFwiIH0sXG4gICAgICAgIHsgdGV4dDogXCJFVk0gRXZlbnRzXCIsIGxpbms6IFwiL2FwaS9ldm0tZXZlbnRzXCIgfSxcbiAgICAgICAgeyB0ZXh0OiBcIkpTT04tUlBDXCIsIGxpbms6IFwiL2FwaS9qc29uLXJwY1wiIH0sXG4gICAgICAgIHsgdGV4dDogXCJNZXRob2RzIE92ZXJ2aWV3XCIsIGxpbms6IFwiL2FwaS9tZXRob2RzXCIgfSxcbiAgICAgICAgeyB0ZXh0OiBcIlBhY2thZ2UgT3ZlcnZpZXdcIiwgbGluazogXCIvYXBpL3BhY2thZ2VzXCIgfSxcbiAgICAgICAgeyB0ZXh0OiBcIkNhbGwgQVBJXCIsIGxpbms6IFwiL2FwaS90ZXZtLWNhbGxcIiB9LFxuICAgICAgICB7IHRleHQ6IFwiVk0gYW5kIFN1Ym1vZHVsZXNcIiwgbGluazogXCIvYXBpL3ZtLWFuZC1zdWJtb2R1bGVzXCIgfSxcbiAgICAgICAgeyB0ZXh0OiBcIkRlY29yYXRvcnNcIiwgbGluazogXCIvYXBpL2RlY29yYXRvcnNcIiB9LFxuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogXCJDdXN0b20gUHJlY29tcGlsZXMgKGFkdmFuY2VkKVwiLFxuICAgICAgICAgIGxpbms6IFwiL2FkdmFuY2VkL2N1c3RvbS1wcmVjb21waWxlc1wiLFxuICAgICAgICB9LFxuICAgICAgICB7IHRleHQ6IFwiVGV2bU5vZGUgKGFkdmFuY2VkKVwiLCBsaW5rOiBcIi9jb3JlL3Rldm0tbm9kZS1pbnRlcmZhY2VcIiB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHRleHQ6IFwiUmVmZXJlbmNlXCIsXG4gICAgICBjb2xsYXBzZWQ6IHRydWUsXG4gICAgICBpdGVtczogW1xuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogXCJDb3JlIFBhY2thZ2VzXCIsXG4gICAgICAgICAgY29sbGFwc2VkOiB0cnVlLFxuICAgICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAgICB7IHRleHQ6IFwiQWN0aW9ucyAoQHRldm0vYWN0aW9ucylcIiwgbGluazogXCIvcmVmZXJlbmNlL2FjdGlvbnNcIiB9LFxuICAgICAgICAgICAgeyB0ZXh0OiBcIlZpcnR1YWwgTWFjaGluZSAoQHRldm0vdm0pXCIsIGxpbms6IFwiL3JlZmVyZW5jZS92bVwiIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRleHQ6IFwiU3RhdGUgTWFuYWdlbWVudCAoQHRldm0vc3RhdGUpXCIsXG4gICAgICAgICAgICAgIGxpbms6IFwiL3JlZmVyZW5jZS9zdGF0ZVwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdGV4dDogXCJCbG9ja2NoYWluIChAdGV2bS9ibG9ja2NoYWluKVwiLFxuICAgICAgICAgICAgICBsaW5rOiBcIi9yZWZlcmVuY2UvYmxvY2tjaGFpblwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHsgdGV4dDogXCJFVk0gKEB0ZXZtL2V2bSlcIiwgbGluazogXCIvcmVmZXJlbmNlL2V2bVwiIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHRleHQ6IFwiVHJhbnNhY3Rpb24gJiBCbG9jayBQYWNrYWdlc1wiLFxuICAgICAgICAgIGNvbGxhcHNlZDogdHJ1ZSxcbiAgICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAgeyB0ZXh0OiBcIkJsb2NrIChAdGV2bS9ibG9jaylcIiwgbGluazogXCIvcmVmZXJlbmNlL2Jsb2NrXCIgfSxcbiAgICAgICAgICAgIHsgdGV4dDogXCJUcmFuc2FjdGlvbnMgKEB0ZXZtL3R4KVwiLCBsaW5rOiBcIi9yZWZlcmVuY2UvdHhcIiB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0ZXh0OiBcIlRyYW5zYWN0aW9uIFBvb2wgKEB0ZXZtL3R4cG9vbClcIixcbiAgICAgICAgICAgICAgbGluazogXCIvcmVmZXJlbmNlL3R4cG9vbFwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdGV4dDogXCJSZWNlaXB0IE1hbmFnZXIgKEB0ZXZtL3JlY2VpcHQtbWFuYWdlcilcIixcbiAgICAgICAgICAgICAgbGluazogXCIvcmVmZXJlbmNlL3JlY2VpcHQtbWFuYWdlclwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogXCJDbGllbnQgJiBDb21tdW5pY2F0aW9uXCIsXG4gICAgICAgICAgY29sbGFwc2VkOiB0cnVlLFxuICAgICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRleHQ6IFwiQ0xJICh0ZXZtKVwiLFxuICAgICAgICAgICAgICBsaW5rOiBcIi9yZWZlcmVuY2UvY2xpXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0ZXh0OiBcIk1lbW9yeSBDbGllbnQgKEB0ZXZtL21lbW9yeS1jbGllbnQpXCIsXG4gICAgICAgICAgICAgIGxpbms6IFwiL3JlZmVyZW5jZS9tZW1vcnktY2xpZW50XCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeyB0ZXh0OiBcIkhUVFAgQ2xpZW50IChAdGV2bS9odHRwLWNsaWVudClcIiwgbGluazogXCIvYXBpL2pzb24tcnBjXCIgfSxcbiAgICAgICAgICAgIHsgdGV4dDogXCJKU09OLVJQQyAoQHRldm0vanNvbnJwYylcIiwgbGluazogXCIvYXBpL2pzb24tcnBjXCIgfSxcbiAgICAgICAgICAgIHsgdGV4dDogXCJTZXJ2ZXIgKEB0ZXZtL3NlcnZlcilcIiwgbGluazogXCIvcmVmZXJlbmNlL3NlcnZlclwiIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHRleHQ6IFwiU21hcnQgQ29udHJhY3QgVG9vbHNcIixcbiAgICAgICAgICBjb2xsYXBzZWQ6IHRydWUsXG4gICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgIHsgdGV4dDogXCJDb250cmFjdCAoQHRldm0vY29udHJhY3QpXCIsIGxpbms6IFwiL3JlZmVyZW5jZS9jb250cmFjdFwiIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRleHQ6IFwiQ29udHJhY3QgQnVuZGxlclwiLFxuICAgICAgICAgICAgICBsaW5rOiBcIi9yZWZlcmVuY2UvYnVuZGxlclwiLFxuICAgICAgICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAgICAgIHsgdGV4dDogXCJPdmVydmlld1wiLCBsaW5rOiBcIi9yZWZlcmVuY2UvYnVuZGxlci9vdmVydmlld1wiIH0sXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiBcIkludGVybmFsc1wiLCBsaW5rOiBcIi9yZWZlcmVuY2UvYnVuZGxlci9pbnRlcm5hbHNcIiB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHRleHQ6IFwiTWV0aG9kcyAmIEV4cG9ydHNcIixcbiAgICAgICAgICAgICAgICAgIGxpbms6IFwiL3JlZmVyZW5jZS9idW5kbGVyL21ldGhvZHNcIixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHRleHQ6IFwiVHJvdWJsZXNob290aW5nXCIsXG4gICAgICAgICAgICAgICAgICBsaW5rOiBcIi9yZWZlcmVuY2UvYnVuZGxlci90cm91Ymxlc2hvb3RpbmdcIixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHsgdGV4dDogXCJDb250cmFjdCBMb2FkZXJcIiwgbGluazogXCIvYXBpL3doYXRzYWJpLWludGVncmF0aW9uXCIgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRleHQ6IFwiUHJlY29tcGlsZXMgKEB0ZXZtL3ByZWNvbXBpbGVzKVwiLFxuICAgICAgICAgICAgICBsaW5rOiBcIi9hZHZhbmNlZC9jdXN0b20tcHJlY29tcGlsZXNcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRleHQ6IFwiUHJlZGVwbG95cyAoQHRldm0vcHJlZGVwbG95cylcIixcbiAgICAgICAgICAgICAgbGluazogXCIvYWR2YW5jZWQvY3VzdG9tLXByZWNvbXBpbGVzXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0ZXh0OiBcIlV0aWxpdGllcyAmIEhlbHBlcnNcIixcbiAgICAgICAgICBjb2xsYXBzZWQ6IHRydWUsXG4gICAgICAgICAgaXRlbXM6IFtcbiAgICAgICAgICAgIHsgdGV4dDogXCJVdGlscyAoQHRldm0vdXRpbHMpXCIsIGxpbms6IFwiL3JlZmVyZW5jZS91dGlsc1wiIH0sXG4gICAgICAgICAgICB7IHRleHQ6IFwiQ29tbW9uIChAdGV2bS9jb21tb24pXCIsIGxpbms6IFwiL3JlZmVyZW5jZS9jb21tb25cIiB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0ZXh0OiBcIkRlY29yYXRvcnMgKEB0ZXZtL2RlY29yYXRvcnMpXCIsXG4gICAgICAgICAgICAgIGxpbms6IFwiL3JlZmVyZW5jZS9kZWNvcmF0b3JzXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeyB0ZXh0OiBcIlByb2NlZHVyZXMgKEB0ZXZtL3Byb2NlZHVyZXMpXCIsIGxpbms6IFwiL2FwaS9tZXRob2RzXCIgfSxcbiAgICAgICAgICAgIHsgdGV4dDogXCJSTFAgKEB0ZXZtL3JscClcIiwgbGluazogXCIvcmVmZXJlbmNlL3JscFwiIH0sXG4gICAgICAgICAgICB7IHRleHQ6IFwiVHJpZSAoQHRldm0vdHJpZSlcIiwgbGluazogXCIvcmVmZXJlbmNlL3RyaWVcIiB9LFxuICAgICAgICAgICAgeyB0ZXh0OiBcIkFkZHJlc3MgKEB0ZXZtL2FkZHJlc3MpXCIsIGxpbms6IFwiL3JlZmVyZW5jZS9hZGRyZXNzXCIgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHRleHQ6IFwiSW50ZWdyYXRpb24gRXhhbXBsZXNcIixcbiAgICAgIGNvbGxhcHNlZDogdHJ1ZSxcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHsgdGV4dDogXCJMb2NhbCBUZXN0aW5nIEZsb3dcIiwgbGluazogXCIvZXhhbXBsZXMvbG9jYWwtdGVzdGluZ1wiIH0sXG4gICAgICAgIHsgdGV4dDogXCJGb3JraW5nIE1haW5uZXRcIiwgbGluazogXCIvZXhhbXBsZXMvZm9ya2luZy1tYWlubmV0XCIgfSxcbiAgICAgICAgeyB0ZXh0OiBcIkJ1aWxkaW5nIGEgRGVidWdnZXIgVUlcIiwgbGluazogXCIvZXhhbXBsZXMvZGVidWdnZXItdWlcIiB9LFxuICAgICAgXSxcbiAgICB9LFxuICBdLFxuICBlZGl0TGluazoge1xuICAgIHBhdHRlcm46XG4gICAgICBcImh0dHBzOi8vZ2l0aHViLmNvbS9ldm10cy90ZXZtLW1vbm9yZXBvL2VkaXQvbWFpbi9kb2NzL25vZGUvZG9jcy9wYWdlcy86cGF0aFwiLFxuICAgIHRleHQ6IFwiRWRpdCB0aGlzIHBhZ2Ugb24gR2l0SHViXCIsXG4gIH0sXG4gIC8vIEVuYWJsZSBzZWFyY2ggd2l0aCBib29zdGluZyBmb3IgaW1wb3J0YW50IHBhZ2VzXG4gIHNlYXJjaDoge1xuICAgIGJvb3N0RG9jdW1lbnQoZG9jdW1lbnRJZCkge1xuICAgICAgaWYgKFxuICAgICAgICBkb2N1bWVudElkLmluY2x1ZGVzKFwiZ2V0dGluZy1zdGFydGVkXCIpIHx8XG4gICAgICAgIGRvY3VtZW50SWQuaW5jbHVkZXMoXCJvdmVydmlld1wiKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiAyO1xuICAgICAgfVxuICAgICAgcmV0dXJuIDE7XG4gICAgfSxcbiAgfSxcbiAgc29jaWFsczogW1xuICAgIHtcbiAgICAgIGljb246IFwiZ2l0aHViXCIsXG4gICAgICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9ldm10cy90ZXZtLW1vbm9yZXBvXCIsXG4gICAgICBsYWJlbDogXCJHaXRodWJcIixcbiAgICB9LFxuICAgIHtcbiAgICAgIGljb246IFwidGVsZWdyYW1cIixcbiAgICAgIGxpbms6IFwiaHR0cHM6Ly90Lm1lLytBTlRoUjliSERMQXdNalV4XCIsXG4gICAgICBsYWJlbDogXCJUZWxlZ3JhbVwiLFxuICAgIH0sXG4gICAge1xuICAgICAgaWNvbjogXCJ4XCIsXG4gICAgICBsaW5rOiBcImh0dHBzOi8veC5jb20vdGV2bXRvb2xzXCIsXG4gICAgICBsYWJlbDogXCJUd2l0dGVyXCIsXG4gICAgfSxcbiAgICB7XG4gICAgICBpY29uOiBcImRpc2NvcmRcIixcbiAgICAgIGxpbms6IFwiaHR0cHM6Ly9kaXNjb3JkLmdnL3Rldm1cIixcbiAgICAgIGxhYmVsOiBcIkRpc2NvcmRcIixcbiAgICB9LFxuICBdLFxuICAvLyBDb25maWd1cmUgY29kZSBoaWdobGlnaHRpbmdcbiAgbWFya2Rvd246IHtcbiAgICBjb2RlOiB7XG4gICAgICB0aGVtZXM6IHtcbiAgICAgICAgbGlnaHQ6IFwiZ2l0aHViLWxpZ2h0XCIsXG4gICAgICAgIGRhcms6IFwiZ2l0aHViLWRhcmtcIixcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFvUyxTQUFTLG9CQUFvQjtBQUVqVSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixPQUFPO0FBQUEsRUFDUCxlQUFlO0FBQUEsRUFDZixTQUNFLFFBQVEsSUFBSSxlQUFlLGVBQ3ZCLHlCQUNBLFFBQVEsSUFBSTtBQUFBLEVBQ2xCLFNBQVM7QUFBQSxFQUNULGFBQ0U7QUFBQTtBQUFBLEVBRUYsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLElBQ1As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
