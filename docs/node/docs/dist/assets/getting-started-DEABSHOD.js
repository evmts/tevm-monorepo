import{u as r,j as e}from"./index-CpiQkTq1.js";const a={title:"Getting Started",description:"Get started with Tevm Node - A JavaScript Ethereum Virtual Machine"};function n(i){const s={a:"a",code:"code",div:"div",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...r(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(s.header,{children:e.jsxs(s.h1,{id:"getting-started",children:["Getting Started",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#getting-started",children:e.jsx(s.div,{"data-autolink-icon":!0})})]})}),`
`,e.jsxs(s.p,{children:["Welcome to ",e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo",children:"Tevm Node"}),"! This guide will help you navigate our documentation and get started with running ",e.jsx(s.a,{href:"https://ethereum.org",children:"Ethereum"})," in JavaScript."]}),`
`,e.jsxs(s.p,{children:["If you're impatient, try creating a ",e.jsx(s.a,{href:"/api/memory-client",children:"memory client"})," and using the ",e.jsx(s.a,{href:"https://viem.sh",children:"viem API"})," to interact with a locally running blockchain in JavaScript:"]}),`
`,e.jsx(e.Fragment,{children:e.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:e.jsx(s.code,{children:e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"npm install tevm"})})})})}),`
`,e.jsx(e.Fragment,{children:e.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:e.jsxs(s.code,{children:[e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" { createMemoryClient, http } "}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" 'tevm/node'"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" { optimism } "}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" 'tevm/common'"})]}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Create a client that forks from Optimism mainnet"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" client"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" createMemoryClient"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"({"})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  fork: {"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"    transport: "}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"http"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"("}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'https://mainnet.optimism.io'"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:")({}),"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"    blockTag: "}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:"420"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"n"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:","})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  },"})}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  common: optimism,"})}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"})"})}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Read block data using viem's public actions"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" block"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" await"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" client."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"getBlock"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"({ blockTag: "}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:"420"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"n"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" })"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"console."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"log"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"(block) "}),e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Block data from Optimism mainnet at block 420"})]})]})})}),`
`,e.jsxs(s.h2,{id:"quick-start",children:["Quick Start",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#quick-start",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(s.p,{children:"Start here to understand the basics:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/introduction/what-is-tevm-node",children:"What is Tevm Node?"})," - Overview and key features"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/introduction/architecture-overview",children:"Architecture Overview"})," - High-level explanation of how Tevm works"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/introduction/why-run-ethereum-in-js",children:"Why run Ethereum in JS?"})," - Benefits and use cases"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/introduction/installation",children:"Installation & Quickstart"})," - Get up and running"]}),`
`]}),`
`,e.jsxs(s.h2,{id:"learning-path",children:["Learning Path",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#learning-path",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.h3,{id:"1-core-concepts",children:["1. Core Concepts",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#1-core-concepts",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(s.p,{children:"Learn the fundamental building blocks:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/core/create-tevm-node",children:"Creating a Node"})," - Set up and configure your node"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/core/tevm-node-interface",children:"Node Interface"})," - Understand the main API surface"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/core/forking",children:"Forking & Reforking"})," - Fork from networks or other Tevm instances"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/core/managing-state",children:"Managing State"})," - Handle accounts, storage, and blockchain state"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"#TODO",children:"Mining Configuration"})," - Configure block production"]}),`
`]}),`
`,e.jsxs(s.h3,{id:"2-essential-apis",children:["2. Essential APIs",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#2-essential-apis",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(s.p,{children:"Most commonly used APIs:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/api/tevm-call",children:"tevmCall API"})," - Execute contract calls and transactions"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/api/json-rpc",children:"JSON-RPC Support"})," - Standard Ethereum JSON-RPC interface"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/api/account-management",children:"Account Management"})," - Work with accounts and balances"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/api/contracts",children:"Contract Utilities"})," - Create and interact with contracts"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/api/utils",children:"Utilities & Addresses"})," - Core utilities for addresses and common operations"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/api/methods",children:"Methods & Properties"})," - Complete API reference"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/api/vm-and-submodules",children:"VM & Submodules"})," - Internal architecture based on ethereumjs"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/api/evm-events",children:"EVM Events"})," - Debug and trace EVM execution"]}),`
`]}),`
`,e.jsxs(s.h3,{id:"3-integration-examples",children:["3. Integration Examples",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#3-integration-examples",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(s.p,{children:"Real-world usage examples:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/examples/local-testing",children:"Local Testing"})," - Write tests for your contracts"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/examples/forking-mainnet",children:"Forking Mainnet"})," - Work with production state locally"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/examples/viem",children:"Using with Viem"})," - Integration with ",e.jsx(s.a,{href:"https://viem.sh",children:"Viem"})]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/examples/ethers",children:"Using with Ethers"})," - Integration with ",e.jsx(s.a,{href:"https://docs.ethers.org",children:"Ethers.js"})]}),`
`]}),`
`,e.jsxs(s.h3,{id:"4-advanced-features",children:["4. Advanced Features",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#4-advanced-features",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(s.p,{children:"Dive deeper into advanced capabilities:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/advanced/txpool",children:"Transaction Pool"})," - Manage pending transactions"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/advanced/custom-precompiles",children:"Custom Precompiles"})," - Extend EVM functionality"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/advanced/performance-profiler",children:"Performance Profiler"})," - Optimize performance"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/advanced/receipts-and-logs",children:"Receipts & Logs"})," - Handle events and logs"]}),`
`]}),`
`,e.jsxs(s.h2,{id:"key-features",children:["Key Features",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#key-features",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.h3,{id:"forking--state-management",children:["Forking & State Management",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#forking--state-management",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"Fork from any EVM-compatible network"}),`
`,e.jsx(s.li,{children:"Memory-efficient reforking strategies"}),`
`,e.jsx(s.li,{children:"Complete state control and manipulation"}),`
`,e.jsx(s.li,{children:"Account impersonation for testing"}),`
`]}),`
`,e.jsxs(s.h3,{id:"performance--flexibility",children:["Performance & Flexibility",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#performance--flexibility",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"Automatic or manual block mining"}),`
`,e.jsx(s.li,{children:"Lazy loading with caching"}),`
`,e.jsx(s.li,{children:"Custom precompiles in JavaScript"}),`
`,e.jsx(s.li,{children:"Comprehensive debugging tools"}),`
`]}),`
`,e.jsxs(s.h3,{id:"developer-experience",children:["Developer Experience",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#developer-experience",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"TypeScript-first design"}),`
`,e.jsx(s.li,{children:"Viem & Ethers.js compatibility"}),`
`,e.jsx(s.li,{children:"Standard JSON-RPC support"}),`
`,e.jsx(s.li,{children:"Rich testing utilities"}),`
`]}),`
`,e.jsxs(s.h2,{id:"additional-resources",children:["Additional Resources",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#additional-resources",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://ethereum.org/en/developers/docs/",children:"Ethereum Development Documentation"})," - Official Ethereum docs"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://ethereum.org/en/developers/docs/evm/",children:"EVM Deep Dive"})," - Understanding the EVM"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://ethereum.org/en/developers/docs/apis/json-rpc/",children:"JSON-RPC API"})," - Standard Ethereum API"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://github.com/ethereumjs/ethereumjs-monorepo",children:"ethereumjs/ethereumjs-monorepo"})," - Core EVM implementation"]}),`
`]}),`
`,e.jsxs(s.h3,{id:"debugging-example",children:["Debugging Example",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#debugging-example",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(e.Fragment,{children:e.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:e.jsxs(s.code,{children:[e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" { createTevmNode } "}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" 'tevm/node'"})]}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" node"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" createTevmNode"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"()"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" vm"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" await"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" node."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"getVm"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"()"})]}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Listen to EVM execution events"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"vm.evm.events?."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"on"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"("}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'step'"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:", ("}),e.jsx(s.span,{style:{color:"#E36209","--shiki-dark":"#F69D50"},children:"step"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:", "}),e.jsx(s.span,{style:{color:"#E36209","--shiki-dark":"#F69D50"},children:"next"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:") "}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"=>"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" {"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  console."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"log"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"("}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'Executing opcode:'"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:", step.opcode.name)"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"  next"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"?.()"})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"})"})}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"vm.evm.events?."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"on"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"("}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'afterMessage'"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:", ("}),e.jsx(s.span,{style:{color:"#E36209","--shiki-dark":"#F69D50"},children:"result"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:", "}),e.jsx(s.span,{style:{color:"#E36209","--shiki-dark":"#F69D50"},children:"next"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:") "}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"=>"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" {"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"  if"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" (result.execResult.exceptionError) {"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"    console."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"error"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"("}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'Error:'"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:", result.execResult.exceptionError)"})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  }"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"  next"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"?.()"})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"})"})}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Your contract interactions here..."})})]})})})]})}function c(i={}){const{wrapper:s}={...r(),...i.components};return s?e.jsx(s,{...i,children:e.jsx(n,{...i})}):n(i)}export{c as default,a as frontmatter};
