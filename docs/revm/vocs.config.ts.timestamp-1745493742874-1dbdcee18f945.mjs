// vocs.config.ts
import { defineConfig } from "file:///Users/williamcory/tevm/main/node_modules/.pnpm/vocs@1.0.0-alpha.62_@types+node@22.14.1_@types+react-dom@18.3.5_@types+react@18.3.18__@_ffaf74491d147a626377deaa146c6bcc/node_modules/vocs/_lib/index.js";
var vocs_config_default = defineConfig({
  title: "REVM Docs",
  titleTemplate: "%s \xB7 Tevm",
  baseUrl: process.env.VERCEL_ENV === "production" ? "https://revm.tevm.sh" : process.env.VERCEL_URL,
  rootDir: ".",
  description: "Comprehensive documentation for REVM - the Rust EVM implementation used by Tevm",
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
    content: "\u{1F680} REVM Documentation is in Beta! Join our [Telegram community](https://t.me/+ANThR9bHDLAwMjUx)",
    dismissable: true,
    backgroundColor: "#e6f7ff"
  },
  // Improved top navigation
  topNav: [
    {
      text: "Docs",
      link: "/introduction",
      match: "/introduction"
    },
    {
      text: "Beginner Tutorial",
      link: "/beginner-tutorial",
      match: "/beginner-tutorial"
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
          link: "https://github.com/ethereumjs/ethereumjs-monorepo"
        }
      ]
    }
  ],
  sidebar: [
    {
      text: "Introduction",
      link: "/introduction"
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
        { text: "Next Steps", link: "/beginner-tutorial/next-steps" }
      ]
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
        { text: "Integration Patterns", link: "/intermediate-concepts/integration-patterns" }
      ]
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
        { text: "JSON-RPC API", link: "/examples/json-rpc-api" }
      ]
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
        { text: "No-STD Compatibility", link: "/expert-reference/no-std-compatibility" }
      ]
    }
  ],
  editLink: {
    pattern: "https://github.com/evmts/tevm-monorepo/edit/main/docs/revm/pages/:path",
    text: "Edit this page on GitHub"
  },
  // Enable search with boosting for important pages
  search: {
    boostDocument(documentId) {
      if (documentId.includes("introduction") || documentId.includes("beginner-tutorial")) {
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidm9jcy5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvd2lsbGlhbWNvcnkvdGV2bS9tYWluL2RvY3MvcmV2bVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3dpbGxpYW1jb3J5L3Rldm0vbWFpbi9kb2NzL3Jldm0vdm9jcy5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3dpbGxpYW1jb3J5L3Rldm0vbWFpbi9kb2NzL3Jldm0vdm9jcy5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidm9jc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICB0aXRsZTogXCJSRVZNIERvY3NcIixcbiAgdGl0bGVUZW1wbGF0ZTogXCIlcyBcdTAwQjcgVGV2bVwiLFxuICBiYXNlVXJsOlxuICAgIHByb2Nlc3MuZW52LlZFUkNFTF9FTlYgPT09IFwicHJvZHVjdGlvblwiXG4gICAgICA/IFwiaHR0cHM6Ly9yZXZtLnRldm0uc2hcIlxuICAgICAgOiBwcm9jZXNzLmVudi5WRVJDRUxfVVJMLFxuICByb290RGlyOiBcIi5cIixcbiAgZGVzY3JpcHRpb246XG4gICAgXCJDb21wcmVoZW5zaXZlIGRvY3VtZW50YXRpb24gZm9yIFJFVk0gLSB0aGUgUnVzdCBFVk0gaW1wbGVtZW50YXRpb24gdXNlZCBieSBUZXZtXCIsXG4gIC8vIFVwZGF0ZWQgbG9nbyBjb25maWd1cmF0aW9uXG4gIGxvZ29Vcmw6IHtcbiAgICBsaWdodDogXCIvdGV2bS1sb2dvLWxpZ2h0LnBuZ1wiLFxuICAgIGRhcms6IFwiL3Rldm0tbG9nby1kYXJrLnBuZ1wiLFxuICB9LFxuICBpY29uVXJsOiBcIi90ZXZtLWxvZ28ud2VicFwiLFxuICAvLyBDb25maWd1cmluZyBPRyBJbWFnZVxuICBvZ0ltYWdlVXJsOlxuICAgIFwiaHR0cHM6Ly92b2NzLmRldi9hcGkvb2c/bG9nbz0lbG9nbyZ0aXRsZT0ldGl0bGUmZGVzY3JpcHRpb249JWRlc2NyaXB0aW9uXCIsXG4gIC8vIFNldCBkZWZhdWx0IGZvbnRcbiAgZm9udDoge1xuICAgIGdvb2dsZTogXCJJbnRlclwiLFxuICB9LFxuICAvLyBFbmhhbmNlIHRoZW1lIHdpdGggYWNjZW50IGNvbG9yXG4gIHRoZW1lOiB7XG4gICAgYWNjZW50Q29sb3I6IFwiIzAwODVGRlwiLFxuICAgIGNvbG9yU2NoZW1lOiBcInN5c3RlbVwiLFxuICB9LFxuICAvLyBCYW5uZXIgZm9yIGltcG9ydGFudCB1cGRhdGVzIG9yIGFubm91bmNlbWVudHNcbiAgYmFubmVyOiB7XG4gICAgY29udGVudDpcbiAgICAgIFwiXHVEODNEXHVERTgwIFJFVk0gRG9jdW1lbnRhdGlvbiBpcyBpbiBCZXRhISBKb2luIG91ciBbVGVsZWdyYW0gY29tbXVuaXR5XShodHRwczovL3QubWUvK0FOVGhSOWJIRExBd01qVXgpXCIsXG4gICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgYmFja2dyb3VuZENvbG9yOiBcIiNlNmY3ZmZcIixcbiAgfSxcbiAgLy8gSW1wcm92ZWQgdG9wIG5hdmlnYXRpb25cbiAgdG9wTmF2OiBbXG4gICAge1xuICAgICAgdGV4dDogXCJEb2NzXCIsXG4gICAgICBsaW5rOiBcIi9pbnRyb2R1Y3Rpb25cIixcbiAgICAgIG1hdGNoOiBcIi9pbnRyb2R1Y3Rpb25cIixcbiAgICB9LFxuICAgIHtcbiAgICAgIHRleHQ6IFwiQmVnaW5uZXIgVHV0b3JpYWxcIixcbiAgICAgIGxpbms6IFwiL2JlZ2lubmVyLXR1dG9yaWFsXCIsXG4gICAgICBtYXRjaDogXCIvYmVnaW5uZXItdHV0b3JpYWxcIixcbiAgICB9LFxuICAgIHsgXG4gICAgICB0ZXh0OiBcIkV4YW1wbGVzXCIsIFxuICAgICAgbGluazogXCIvZXhhbXBsZXNcIiwgXG4gICAgICBtYXRjaDogXCIvZXhhbXBsZXNcIiBcbiAgICB9LFxuICAgIHtcbiAgICAgIHRleHQ6IFwiRWNvc3lzdGVtXCIsXG4gICAgICBpdGVtczogW1xuICAgICAgICB7IHRleHQ6IFwiVGV2bVwiLCBsaW5rOiBcImh0dHBzOi8vdGV2bS5zaC9cIiB9LFxuICAgICAgICB7IHRleHQ6IFwiVmllbVwiLCBsaW5rOiBcImh0dHBzOi8vdmllbS5zaC9cIiB9LFxuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogXCJFdGhlcmV1bWpzXCIsXG4gICAgICAgICAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vZXRoZXJldW1qcy9ldGhlcmV1bWpzLW1vbm9yZXBvXCIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIF0sXG4gIHNpZGViYXI6IFtcbiAgICB7XG4gICAgICB0ZXh0OiBcIkludHJvZHVjdGlvblwiLFxuICAgICAgbGluazogXCIvaW50cm9kdWN0aW9uXCIsXG4gICAgfSxcbiAgICB7XG4gICAgICB0ZXh0OiBcIkJlZ2lubmVyIFR1dG9yaWFsXCIsXG4gICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAgeyB0ZXh0OiBcIkludHJvZHVjdGlvbiB0byBSRVZNXCIsIGxpbms6IFwiL2JlZ2lubmVyLXR1dG9yaWFsL2ludHJvZHVjdGlvbi10by1yZXZtXCIgfSxcbiAgICAgICAgeyB0ZXh0OiBcIkdldHRpbmcgU3RhcnRlZFwiLCBsaW5rOiBcIi9iZWdpbm5lci10dXRvcmlhbC9nZXR0aW5nLXN0YXJ0ZWRcIiB9LFxuICAgICAgICB7IHRleHQ6IFwiQmFzaWMgVHJhbnNhY3Rpb24gRXhlY3V0aW9uXCIsIGxpbms6IFwiL2JlZ2lubmVyLXR1dG9yaWFsL2Jhc2ljLXRyYW5zYWN0aW9uLWV4ZWN1dGlvblwiIH0sXG4gICAgICAgIHsgdGV4dDogXCJTbWFydCBDb250cmFjdCBEZXBsb3ltZW50XCIsIGxpbms6IFwiL2JlZ2lubmVyLXR1dG9yaWFsL3NtYXJ0LWNvbnRyYWN0LWRlcGxveW1lbnRcIiB9LFxuICAgICAgICB7IHRleHQ6IFwiU3RhdGUgTWFuYWdlbWVudFwiLCBsaW5rOiBcIi9iZWdpbm5lci10dXRvcmlhbC9zdGF0ZS1tYW5hZ2VtZW50XCIgfSxcbiAgICAgICAgeyB0ZXh0OiBcIk5leHQgU3RlcHNcIiwgbGluazogXCIvYmVnaW5uZXItdHV0b3JpYWwvbmV4dC1zdGVwc1wiIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgdGV4dDogXCJJbnRlcm1lZGlhdGUgQ29uY2VwdHNcIixcbiAgICAgIGNvbGxhcHNlZDogZmFsc2UsXG4gICAgICBpdGVtczogW1xuICAgICAgICB7IHRleHQ6IFwiUkVWTSBBcmNoaXRlY3R1cmVcIiwgbGluazogXCIvaW50ZXJtZWRpYXRlLWNvbmNlcHRzL3Jldm0tYXJjaGl0ZWN0dXJlXCIgfSxcbiAgICAgICAgeyB0ZXh0OiBcIkVWTSBFeGVjdXRpb24gTW9kZWxcIiwgbGluazogXCIvaW50ZXJtZWRpYXRlLWNvbmNlcHRzL2V2bS1leGVjdXRpb24tbW9kZWxcIiB9LFxuICAgICAgICB7IHRleHQ6IFwiU3RhdGUgYW5kIFN0b3JhZ2VcIiwgbGluazogXCIvaW50ZXJtZWRpYXRlLWNvbmNlcHRzL3N0YXRlLWFuZC1zdG9yYWdlXCIgfSxcbiAgICAgICAgeyB0ZXh0OiBcIlRyYW5zYWN0aW9uIFByb2Nlc3NpbmdcIiwgbGluazogXCIvaW50ZXJtZWRpYXRlLWNvbmNlcHRzL3RyYW5zYWN0aW9uLXByb2Nlc3NpbmdcIiB9LFxuICAgICAgICB7IHRleHQ6IFwiQmxvY2sgUHJvY2Vzc2luZ1wiLCBsaW5rOiBcIi9pbnRlcm1lZGlhdGUtY29uY2VwdHMvYmxvY2stcHJvY2Vzc2luZ1wiIH0sXG4gICAgICAgIHsgdGV4dDogXCJFVk0gQ3VzdG9taXphdGlvblwiLCBsaW5rOiBcIi9pbnRlcm1lZGlhdGUtY29uY2VwdHMvZXZtLWN1c3RvbWl6YXRpb25cIiB9LFxuICAgICAgICB7IHRleHQ6IFwiUGVyZm9ybWFuY2UgQ29uc2lkZXJhdGlvbnNcIiwgbGluazogXCIvaW50ZXJtZWRpYXRlLWNvbmNlcHRzL3BlcmZvcm1hbmNlLWNvbnNpZGVyYXRpb25zXCIgfSxcbiAgICAgICAgeyB0ZXh0OiBcIkludGVncmF0aW9uIFBhdHRlcm5zXCIsIGxpbms6IFwiL2ludGVybWVkaWF0ZS1jb25jZXB0cy9pbnRlZ3JhdGlvbi1wYXR0ZXJuc1wiIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgdGV4dDogXCJFeGFtcGxlc1wiLFxuICAgICAgY29sbGFwc2VkOiBmYWxzZSxcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHsgdGV4dDogXCJCYXNpYyBUcmFuc2FjdGlvbiBQcm9jZXNzaW5nXCIsIGxpbms6IFwiL2V4YW1wbGVzL2Jhc2ljLXRyYW5zYWN0aW9uLXByb2Nlc3NpbmdcIiB9LFxuICAgICAgICB7IHRleHQ6IFwiQ29udHJhY3QgRGVwbG95bWVudCAmIEludGVyYWN0aW9uXCIsIGxpbms6IFwiL2V4YW1wbGVzL2NvbnRyYWN0LWRlcGxveW1lbnQtaW50ZXJhY3Rpb25cIiB9LFxuICAgICAgICB7IHRleHQ6IFwiU3RhdGUgTWFuaXB1bGF0aW9uXCIsIGxpbms6IFwiL2V4YW1wbGVzL3N0YXRlLW1hbmlwdWxhdGlvblwiIH0sXG4gICAgICAgIHsgdGV4dDogXCJHYXMgUHJvZmlsaW5nXCIsIGxpbms6IFwiL2V4YW1wbGVzL2dhcy1wcm9maWxpbmdcIiB9LFxuICAgICAgICB7IHRleHQ6IFwiVHJhY2luZyAmIERlYnVnZ2luZ1wiLCBsaW5rOiBcIi9leGFtcGxlcy90cmFjaW5nLWRlYnVnZ2luZ1wiIH0sXG4gICAgICAgIHsgdGV4dDogXCJCbG9jayBFeHBsb3JlclwiLCBsaW5rOiBcIi9leGFtcGxlcy9ibG9jay1leHBsb3JlclwiIH0sXG4gICAgICAgIHsgdGV4dDogXCJGb3JraW5nIE5ldHdvcmtcIiwgbGluazogXCIvZXhhbXBsZXMvZm9ya2luZy1uZXR3b3JrXCIgfSxcbiAgICAgICAgeyB0ZXh0OiBcIkpTT04tUlBDIEFQSVwiLCBsaW5rOiBcIi9leGFtcGxlcy9qc29uLXJwYy1hcGlcIiB9LFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHRleHQ6IFwiRXhwZXJ0IFJlZmVyZW5jZVwiLFxuICAgICAgY29sbGFwc2VkOiB0cnVlLFxuICAgICAgaXRlbXM6IFtcbiAgICAgICAgeyB0ZXh0OiBcIkFQSSBSZWZlcmVuY2VcIiwgbGluazogXCIvZXhwZXJ0LXJlZmVyZW5jZS9hcGktcmVmZXJlbmNlXCIgfSxcbiAgICAgICAgeyB0ZXh0OiBcIkNvcmUgVHJhaXRzIGFuZCBJbnRlcmZhY2VzXCIsIGxpbms6IFwiL2V4cGVydC1yZWZlcmVuY2UvY29yZS10cmFpdHMtYW5kLWludGVyZmFjZXNcIiB9LFxuICAgICAgICB7IHRleHQ6IFwiQ29udGV4dCBDb21wb25lbnRzXCIsIGxpbms6IFwiL2V4cGVydC1yZWZlcmVuY2UvY29udGV4dC1jb21wb25lbnRzXCIgfSxcbiAgICAgICAgeyB0ZXh0OiBcIkluc3RydWN0aW9uIFNldFwiLCBsaW5rOiBcIi9leHBlcnQtcmVmZXJlbmNlL2luc3RydWN0aW9uLXNldFwiIH0sXG4gICAgICAgIHsgdGV4dDogXCJQcmVjb21waWxlZCBDb250cmFjdHNcIiwgbGluazogXCIvZXhwZXJ0LXJlZmVyZW5jZS9wcmVjb21waWxlZC1jb250cmFjdHNcIiB9LFxuICAgICAgICB7IHRleHQ6IFwiU3RhdGUgTWFuYWdlbWVudFwiLCBsaW5rOiBcIi9leHBlcnQtcmVmZXJlbmNlL3N0YXRlLW1hbmFnZW1lbnRcIiB9LFxuICAgICAgICB7IHRleHQ6IFwiRGF0YWJhc2UgQ29tcG9uZW50c1wiLCBsaW5rOiBcIi9leHBlcnQtcmVmZXJlbmNlL2RhdGFiYXNlLWNvbXBvbmVudHNcIiB9LFxuICAgICAgICB7IHRleHQ6IFwiSW5zcGVjdGlvbiBTeXN0ZW1cIiwgbGluazogXCIvZXhwZXJ0LXJlZmVyZW5jZS9pbnNwZWN0aW9uLXN5c3RlbVwiIH0sXG4gICAgICAgIHsgdGV4dDogXCJOby1TVEQgQ29tcGF0aWJpbGl0eVwiLCBsaW5rOiBcIi9leHBlcnQtcmVmZXJlbmNlL25vLXN0ZC1jb21wYXRpYmlsaXR5XCIgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgXSxcbiAgZWRpdExpbms6IHtcbiAgICBwYXR0ZXJuOlxuICAgICAgXCJodHRwczovL2dpdGh1Yi5jb20vZXZtdHMvdGV2bS1tb25vcmVwby9lZGl0L21haW4vZG9jcy9yZXZtL3BhZ2VzLzpwYXRoXCIsXG4gICAgdGV4dDogXCJFZGl0IHRoaXMgcGFnZSBvbiBHaXRIdWJcIixcbiAgfSxcbiAgLy8gRW5hYmxlIHNlYXJjaCB3aXRoIGJvb3N0aW5nIGZvciBpbXBvcnRhbnQgcGFnZXNcbiAgc2VhcmNoOiB7XG4gICAgYm9vc3REb2N1bWVudChkb2N1bWVudElkKSB7XG4gICAgICBpZiAoXG4gICAgICAgIGRvY3VtZW50SWQuaW5jbHVkZXMoXCJpbnRyb2R1Y3Rpb25cIikgfHxcbiAgICAgICAgZG9jdW1lbnRJZC5pbmNsdWRlcyhcImJlZ2lubmVyLXR1dG9yaWFsXCIpXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIDI7XG4gICAgICB9XG4gICAgICByZXR1cm4gMTtcbiAgICB9LFxuICB9LFxuICBzb2NpYWxzOiBbXG4gICAge1xuICAgICAgaWNvbjogXCJnaXRodWJcIixcbiAgICAgIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL2V2bXRzL3Rldm0tbW9ub3JlcG9cIixcbiAgICAgIGxhYmVsOiBcIkdpdGh1YlwiLFxuICAgIH0sXG4gICAge1xuICAgICAgaWNvbjogXCJ0ZWxlZ3JhbVwiLFxuICAgICAgbGluazogXCJodHRwczovL3QubWUvK0FOVGhSOWJIRExBd01qVXhcIixcbiAgICAgIGxhYmVsOiBcIlRlbGVncmFtXCIsXG4gICAgfSxcbiAgICB7XG4gICAgICBpY29uOiBcInhcIixcbiAgICAgIGxpbms6IFwiaHR0cHM6Ly94LmNvbS90ZXZtdG9vbHNcIixcbiAgICAgIGxhYmVsOiBcIlR3aXR0ZXJcIixcbiAgICB9LFxuICBdLFxuICAvLyBDb25maWd1cmUgY29kZSBoaWdobGlnaHRpbmdcbiAgbWFya2Rvd246IHtcbiAgICBjb2RlOiB7XG4gICAgICB0aGVtZXM6IHtcbiAgICAgICAgbGlnaHQ6IFwiZ2l0aHViLWxpZ2h0XCIsXG4gICAgICAgIGRhcms6IFwiZ2l0aHViLWRhcmtcIixcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBb1MsU0FBUyxvQkFBb0I7QUFFalUsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsT0FBTztBQUFBLEVBQ1AsZUFBZTtBQUFBLEVBQ2YsU0FDRSxRQUFRLElBQUksZUFBZSxlQUN2Qix5QkFDQSxRQUFRLElBQUk7QUFBQSxFQUNsQixTQUFTO0FBQUEsRUFDVCxhQUNFO0FBQUE7QUFBQSxFQUVGLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxJQUNQLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTO0FBQUE7QUFBQSxFQUVULFlBQ0U7QUFBQTtBQUFBLEVBRUYsTUFBTTtBQUFBLElBQ0osUUFBUTtBQUFBLEVBQ1Y7QUFBQTtBQUFBLEVBRUEsT0FBTztBQUFBLElBQ0wsYUFBYTtBQUFBLElBQ2IsYUFBYTtBQUFBLEVBQ2Y7QUFBQTtBQUFBLEVBRUEsUUFBUTtBQUFBLElBQ04sU0FDRTtBQUFBLElBQ0YsYUFBYTtBQUFBLElBQ2IsaUJBQWlCO0FBQUEsRUFDbkI7QUFBQTtBQUFBLEVBRUEsUUFBUTtBQUFBLElBQ047QUFBQSxNQUNFLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE9BQU87QUFBQSxJQUNUO0FBQUEsSUFDQTtBQUFBLE1BQ0UsTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sT0FBTztBQUFBLElBQ1Q7QUFBQSxJQUNBO0FBQUEsTUFDRSxNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixPQUFPO0FBQUEsSUFDVDtBQUFBLElBQ0E7QUFBQSxNQUNFLE1BQU07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
