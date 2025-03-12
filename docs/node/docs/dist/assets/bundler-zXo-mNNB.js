import{u as r,j as e}from"./index-Bp8QJzBc.js";const o={title:"Bundler Reference",description:"A reference guide to Tevm's bundler functionality"};function i(t){const n={a:"a",aside:"aside",code:"code",div:"div",h1:"h1",h2:"h2",header:"header",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...r(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(n.header,{children:e.jsxs(n.h1,{id:"tevm-contract-bundler",children:["Tevm Contract Bundler",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#tevm-contract-bundler",children:e.jsx(n.div,{"data-autolink-icon":!0})})]})}),`
`,e.jsx(n.p,{children:"The Tevm Contract Bundler allows you to import Solidity files directly into your TypeScript code, enabling a seamless development experience with type safety and IDE integration."}),`
`,e.jsx(n.aside,{"data-callout":"note",children:e.jsxs(n.p,{children:["This page has been split into smaller, more manageable sections. Please visit the new ",e.jsx(n.a,{href:"/reference/bundler",children:"Bundler Reference"})," for the updated documentation."]})}),`
`,e.jsxs(n.h2,{id:"quick-navigation",children:["Quick Navigation",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#quick-navigation",children:e.jsx(n.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(n.p,{children:"The bundler documentation is now split into several sections for better organization:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:e.jsx(n.a,{href:"/reference/bundler/overview",children:"Overview"})})," - Introduction, key benefits, available plugins"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:e.jsx(n.a,{href:"/reference/bundler/internals",children:"Internals"})})," - How the bundler works under the hood"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:e.jsx(n.a,{href:"/reference/bundler/methods",children:"Methods & Exports"})})," - Key APIs for advanced usage"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:e.jsx(n.a,{href:"/reference/bundler/troubleshooting",children:"Troubleshooting"})})," - Common issues and solutions"]}),`
`]}),`
`,e.jsxs(n.h2,{id:"what-is-the-tevm-bundler",children:["What is the Tevm Bundler?",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#what-is-the-tevm-bundler",children:e.jsx(n.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(n.p,{children:["The Tevm bundler transforms Solidity ",e.jsx(n.code,{children:".sol"})," files into TypeScript modules at build time. When you import a contract, the bundler:"]}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsx(n.li,{children:"Reads and compiles the Solidity source code"}),`
`,e.jsx(n.li,{children:"Extracts the ABI, bytecode, and other contract information"}),`
`,e.jsxs(n.li,{children:["Generates a TypeScript module with a ",e.jsx(n.a,{href:"/reference/contract",children:"Tevm Contract"})," instance"]}),`
`]}),`
`,e.jsx(n.p,{children:"This means you can interact with your contracts in a fully type-safe way, with editor features like auto-completion, go-to-definition, and inline documentation."}),`
`,e.jsxs(n.h2,{id:"getting-started",children:["Getting Started",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#getting-started",children:e.jsx(n.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(n.p,{children:["For a quick introduction to using the bundler, see the ",e.jsx(n.a,{href:"/getting-started/bundler",children:"Bundler Quickstart"})," guide."]}),`
`,e.jsx(n.p,{children:"If you're looking for detailed reference information, explore the sections linked above."}),`
`,e.jsxs(n.h2,{id:"coming-soon-features",children:["Coming Soon Features",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#coming-soon-features",children:e.jsx(n.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(n.p,{children:"Tevm is actively developing new bundler features:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsxs(n.strong,{children:["Inline Solidity with ",e.jsx(n.code,{children:"sol"})," Tag"]})," - Define contracts directly in your JS/TS using template literals"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"CAIP-10 Contract Imports"})," - Import contracts from any chain using standardized identifiers"]}),`
`]}),`
`,e.jsxs(n.p,{children:["Learn more about these upcoming features in the ",e.jsx(n.a,{href:"/reference/bundler/overview#coming-soon-features",children:"Upcoming Features"})," section."]})]})}function d(t={}){const{wrapper:n}={...r(),...t.components};return n?e.jsx(n,{...t,children:e.jsx(i,{...t})}):i(t)}export{d as default,o as frontmatter};
