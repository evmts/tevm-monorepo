import{u as r,j as e}from"./index-afFmagsP.js";const l={title:"Getting Started",description:"Get started with Tevm Node - A JavaScript Ethereum Virtual Machine"};function s(i){const n={a:"a",code:"code",div:"div",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...r(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(n.header,{children:e.jsxs(n.h1,{id:"getting-started",children:["Getting Started",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#getting-started",children:e.jsx(n.div,{"data-autolink-icon":!0})})]})}),`
`,e.jsxs(n.p,{children:["Welcome to ",e.jsx(n.a,{href:"https://github.com/evmts/tevm-monorepo",children:"Tevm Node"}),"! This guide will help you navigate our documentation and get started with running ",e.jsx(n.a,{href:"https://ethereum.org",children:"Ethereum"})," in JavaScript."]}),`
`,e.jsxs(n.p,{children:["If you're impatient, try creating a ",e.jsx(n.a,{href:"/api/memory-client",children:"memory client"})," and using the ",e.jsx(n.a,{href:"https://viem.sh",children:"viem API"})," to interact with a locally running blockchain in JavaScript:"]}),`
`,e.jsx(e.Fragment,{children:e.jsx(n.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:e.jsx(n.code,{children:e.jsx(n.span,{className:"line",children:e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"npm install tevm"})})})})}),`
`,e.jsx(e.Fragment,{children:e.jsx(n.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:e.jsxs(n.code,{children:[e.jsxs(n.span,{className:"line",children:[e.jsx(n.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" { createMemoryClient, http } "}),e.jsx(n.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" 'tevm/node'"})]}),`
`,e.jsxs(n.span,{className:"line",children:[e.jsx(n.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" { optimism } "}),e.jsx(n.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" 'tevm/common'"})]}),`
`,e.jsx(n.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsx(n.span,{className:"line",children:e.jsx(n.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Create a client that forks from Optimism mainnet"})}),`
`,e.jsxs(n.span,{className:"line",children:[e.jsx(n.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(n.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" client"}),e.jsx(n.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(n.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" createMemoryClient"}),e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"({"})]}),`
`,e.jsx(n.span,{className:"line",children:e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  fork: {"})}),`
`,e.jsxs(n.span,{className:"line",children:[e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"    transport: "}),e.jsx(n.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"http"}),e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"("}),e.jsx(n.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'https://mainnet.optimism.io'"}),e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:")({}),"})]}),`
`,e.jsxs(n.span,{className:"line",children:[e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"    blockTag: "}),e.jsx(n.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:"420"}),e.jsx(n.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"n"}),e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:","})]}),`
`,e.jsx(n.span,{className:"line",children:e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  },"})}),`
`,e.jsx(n.span,{className:"line",children:e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  common: optimism,"})}),`
`,e.jsx(n.span,{className:"line",children:e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"})"})}),`
`,e.jsx(n.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsx(n.span,{className:"line",children:e.jsx(n.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Read block data using viem's public actions"})}),`
`,e.jsxs(n.span,{className:"line",children:[e.jsx(n.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(n.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" block"}),e.jsx(n.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(n.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" await"}),e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" client."}),e.jsx(n.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"getBlock"}),e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"({ blockTag: "}),e.jsx(n.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:"420"}),e.jsx(n.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"n"}),e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" })"})]}),`
`,e.jsxs(n.span,{className:"line",children:[e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"console."}),e.jsx(n.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"log"}),e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"(block) "}),e.jsx(n.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Block data from Optimism mainnet at block 420"})]})]})})}),`
`,e.jsxs(n.h2,{id:"quick-start",children:["Quick Start",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#quick-start",children:e.jsx(n.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(n.p,{children:"Start here to understand the basics:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/introduction/what-is-tevm-node",children:"What is Tevm Node?"})," - Overview and key features"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/introduction/architecture-overview",children:"Architecture Overview"})," - High-level explanation of how Tevm works"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/introduction/why-run-ethereum-in-js",children:"Why run Ethereum in JS?"})," - Benefits and use cases"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/introduction/installation",children:"Installation & Quickstart"})," - Get up and running"]}),`
`]}),`
`,e.jsxs(n.h2,{id:"learning-path",children:["Learning Path",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#learning-path",children:e.jsx(n.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(n.h3,{id:"1-core-concepts",children:["1. Core Concepts",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#1-core-concepts",children:e.jsx(n.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(n.p,{children:"Learn the fundamental building blocks:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/core/create-tevm-node",children:"Creating a Node"})," - Set up and configure your node"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/core/tevm-node-interface",children:"Node Interface"})," - Understand the main API surface"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/core/forking",children:"Forking & Reforking"})," - Fork from networks or other Tevm instances"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/core/managing-state",children:"Managing State"})," - Handle accounts, storage, and blockchain state"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"#TODO",children:"Mining Configuration"})," - Configure block production"]}),`
`]}),`
`,e.jsxs(n.h3,{id:"2-essential-apis",children:["2. Essential APIs",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#2-essential-apis",children:e.jsx(n.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(n.p,{children:"Most commonly used APIs:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/api/tevm-call",children:"tevmCall API"})," - Execute contract calls and transactions"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/api/json-rpc",children:"JSON-RPC Support"})," - Standard Ethereum JSON-RPC interface"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/api/account-management",children:"Account Management"})," - Work with accounts and balances"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/api/contracts",children:"Contract Utilities"})," - Create and interact with contracts"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/api/utils",children:"Utilities & Addresses"})," - Core utilities for addresses and common operations"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/api/methods",children:"Methods & Properties"})," - Complete API reference"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/api/vm-and-submodules",children:"VM & Submodules"})," - Internal architecture based on ethereumjs"]}),`
`]}),`
`,e.jsxs(n.h3,{id:"3-integration-examples",children:["3. Integration Examples",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#3-integration-examples",children:e.jsx(n.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(n.p,{children:"Real-world usage examples:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/examples/local-testing",children:"Local Testing"})," - Write tests for your contracts"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/examples/forking-mainnet",children:"Forking Mainnet"})," - Work with production state locally"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/examples/viem",children:"Using with Viem"})," - Integration with ",e.jsx(n.a,{href:"https://viem.sh",children:"Viem"})]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/examples/ethers",children:"Using with Ethers"})," - Integration with ",e.jsx(n.a,{href:"https://docs.ethers.org",children:"Ethers.js"})]}),`
`]}),`
`,e.jsxs(n.h3,{id:"4-advanced-features",children:["4. Advanced Features",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#4-advanced-features",children:e.jsx(n.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(n.p,{children:"Dive deeper into advanced capabilities:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/advanced/txpool",children:"Transaction Pool"})," - Manage pending transactions"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/advanced/custom-precompiles",children:"Custom Precompiles"})," - Extend EVM functionality"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/advanced/performance-profiler",children:"Performance Profiler"})," - Optimize performance"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"/advanced/receipts-and-logs",children:"Receipts & Logs"})," - Handle events and logs"]}),`
`]}),`
`,e.jsxs(n.h2,{id:"key-features",children:["Key Features",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#key-features",children:e.jsx(n.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(n.h3,{id:"forking--state-management",children:["Forking & State Management",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#forking--state-management",children:e.jsx(n.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Fork from any EVM-compatible network"}),`
`,e.jsx(n.li,{children:"Memory-efficient reforking strategies"}),`
`,e.jsx(n.li,{children:"Complete state control and manipulation"}),`
`,e.jsx(n.li,{children:"Account impersonation for testing"}),`
`]}),`
`,e.jsxs(n.h3,{id:"performance--flexibility",children:["Performance & Flexibility",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#performance--flexibility",children:e.jsx(n.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Automatic or manual block mining"}),`
`,e.jsx(n.li,{children:"Lazy loading with caching"}),`
`,e.jsx(n.li,{children:"Custom precompiles in JavaScript"}),`
`,e.jsx(n.li,{children:"Comprehensive debugging tools"}),`
`]}),`
`,e.jsxs(n.h3,{id:"developer-experience",children:["Developer Experience",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#developer-experience",children:e.jsx(n.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"TypeScript-first design"}),`
`,e.jsx(n.li,{children:"Viem & Ethers.js compatibility"}),`
`,e.jsx(n.li,{children:"Standard JSON-RPC support"}),`
`,e.jsx(n.li,{children:"Rich testing utilities"}),`
`]}),`
`,e.jsxs(n.h2,{id:"additional-resources",children:["Additional Resources",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#additional-resources",children:e.jsx(n.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"https://ethereum.org/en/developers/docs/",children:"Ethereum Development Documentation"})," - Official Ethereum docs"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"https://ethereum.org/en/developers/docs/evm/",children:"EVM Deep Dive"})," - Understanding the EVM"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"https://ethereum.org/en/developers/docs/apis/json-rpc/",children:"JSON-RPC API"})," - Standard Ethereum API"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.a,{href:"https://github.com/ethereumjs/ethereumjs-monorepo",children:"ethereumjs/ethereumjs-monorepo"})," - Core EVM implementation"]}),`
`]})]})}function t(i={}){const{wrapper:n}={...r(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(s,{...i})}):s(i)}export{t as default,l as frontmatter};
