import{u as r,j as e}from"./index-CZjtPKYw.js";const l={title:"Getting Started",description:"Get started with Tevm Node - A JavaScript Ethereum Virtual Machine"};function n(i){const s={a:"a",code:"code",div:"div",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...r(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(s.header,{children:e.jsxs(s.h1,{id:"getting-started",children:["Getting Started",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#getting-started",children:e.jsx(s.div,{"data-autolink-icon":!0})})]})}),`
`,e.jsxs(s.p,{children:["Welcome to ",e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo",children:"Tevm Node"}),"! This guide will help you navigate our documentation and get started with running ",e.jsx(s.a,{href:"https://ethereum.org",children:"Ethereum"})," in JavaScript."]}),`
`,e.jsxs(s.h2,{id:"installation",children:["Installation",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#installation",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(e.Fragment,{children:e.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:e.jsx(s.code,{children:e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#F69D50"},children:"npm"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" install"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" tevm"})]})})})}),`
`,e.jsxs(s.h2,{id:"quick-examples",children:["Quick Examples",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#quick-examples",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.h3,{id:"1-raw-tevm-node-api",children:["1. Raw Tevm Node API",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#1-raw-tevm-node-api",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.p,{children:["The most direct way to use Tevm is with the raw ",e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/blob/main/packages/node/docs/functions/createTevmNode.md",children:e.jsx(s.code,{children:"createTevmNode"})})," API. This gives you access to the ",e.jsx(s.a,{href:"/api/actions",children:"complete actions API"}),":"]}),`
`,e.jsx(e.Fragment,{children:e.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:e.jsxs(s.code,{children:[e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" { createTevmNode } "}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" 'tevm'"})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// tevm/actions has many useful high level actions to interact with"})}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// the tevm api including the entire json rpc api"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" {"})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  callHandler,"})}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  setAccountHandler,"})}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  getAccountHandler,"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"} "}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" 'tevm/actions'"})]}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" node"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" createTevmNode"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"()"})]}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Execute a contract call"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" result"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" await"}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" callHandler"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"(node)({"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  to: "}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'0x1234567890123456789012345678901234567890'"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:","})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  data: "}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'0x...'"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:","})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  value: "}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:"0"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"n"})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"})"})}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Set account state"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"await"}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" tevmSetAccountHandler"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"(node)({"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  address: "}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'0x1234567890123456789012345678901234567890'"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:","})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  balance: "}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:"1000000000000000000"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"n"}),e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:" // 1 ETH"})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"})"})}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Get account state"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" account"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" await"}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" getAccountHandler"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"(node)({"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  address: "}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'0x1234567890123456789012345678901234567890'"})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"})"})}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// You can also interact directly with the low level node apis"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" vm"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" await"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" node."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"getVm"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"()"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"await"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" node.blockchain."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"putBlock"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"(newBlock)"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"await"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" node.stateManager."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"putContractCode"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"("}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"createAddress"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"("}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:"420"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"), "}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"hexToBytes"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"("}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'0x...'"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"))"})]})]})})}),`
`,e.jsxs(s.h3,{id:"2-using-with-viem",children:["2. Using with Viem",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#2-using-with-viem",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.p,{children:["For a more familiar developer experience, you can use ",e.jsx(s.a,{href:"/examples/viem",children:"Tevm with Viem"}),":"]}),`
`,e.jsxs(s.p,{children:["You can still use the ",e.jsx(s.a,{href:"#1-raw-tevm-node-api",children:"Raw Tevm Node API"})," referencing ",e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/blob/main/packages/node/docs/functions/createTevmNode.md",children:e.jsx(s.code,{children:"client.transport.tevm"})})]}),`
`,e.jsx(e.Fragment,{children:e.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:e.jsxs(s.code,{children:[e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" { createMemoryClient, http } "}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" 'tevm'"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" { optimism } "}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" 'tevm/common'"})]}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Create a client that forks from Optimism mainnet"})}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// See [MemoryClient docs](/api/memory-client) for more configuration options"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" client"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" createMemoryClient"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"({"})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  fork: {"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"    transport: "}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"http"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"("}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'https://mainnet.optimism.io'"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:")({}),"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"    blockTag: "}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'latest'"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:","})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  },"})}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  common: optimism,"})}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"})"})}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Use viem's public, wallet, or test actions"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" block"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" await"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" client."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"getBlock"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"({ blockTag: "}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'latest'"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" })"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"console."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"log"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"(block)"})]}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Mix with Tevm actions"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" testAddress"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" '0x1234567890123456789012345678901234567890'"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"await"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" client."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"tevmSetAccount"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"({"})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  address: testAddress,"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  balance: "}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:"1000000000000000000"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"n"}),e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:" // 1 ETH"})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"})"})}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Get account state"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" account"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" await"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" client."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"tevmGetAccount"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"({ address: testAddress })"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"console."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"log"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"(account)"})]}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Use the raw Tevm node api via `client.transport.tevm`"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" vm"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" await"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" client.transport.tevm."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"getVm"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"()"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" block"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" await"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" vm.blockchain."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"getBlockByTag"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"("}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'latest'"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:")"})]})]})})}),`
`,e.jsxs(s.h3,{id:"3-using-with-ethers",children:["3. Using with Ethers",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#3-using-with-ethers",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.p,{children:["You can also use Tevm with ",e.jsx(s.a,{href:"/examples/ethers",children:"Ethers.js"}),":"]}),`
`,e.jsx(e.Fragment,{children:e.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:e.jsxs(s.code,{children:[e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" { createTevmNode } "}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" 'tevm'"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" { requestEip1193 } "}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" 'tevm/decorators'"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" { BrowserProvider } "}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" 'ethers'"})]}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Create Tevm Node with EIP-1193 support"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" node"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" createTevmNode"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"()."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"extend"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"("}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"requestEip1193"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"())"})]}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Create Ethers provider"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" provider"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" new"}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" BrowserProvider"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"(node)"})]}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Use standard Ethers API"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" block"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" await"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" provider."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"getBlockNumber"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"()"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" balance"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" await"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" provider."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"getBalance"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"("}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'0x1234...'"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:")"})]})]})})}),`
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
`,e.jsxs(s.h2,{id:"package-documentation",children:["Package Documentation",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#package-documentation",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.p,{children:["All Tevm packages can be installed individually (e.g., ",e.jsx(s.code,{children:"npm install @tevm/actions"}),") or together by installing ",e.jsx(s.code,{children:"tevm"})," and importing from the specific package (e.g., ",e.jsx(s.code,{children:"import { ... } from 'tevm/actions'"}),"). Each package has its own generated API documentation:"]}),`
`,e.jsxs(s.h3,{id:"core-packages",children:["Core Packages",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#core-packages",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/actions/docs",children:"@tevm/actions"})," - Comprehensive set of actions for interacting with the Tevm client"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/vm/docs",children:"@tevm/vm"})," - Custom Ethereum Virtual Machine implementation"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs",children:"@tevm/state"})," - State management for accounts, storage, and contracts"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/blockchain/docs",children:"@tevm/blockchain"})," - Blockchain implementation and block management"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/evm/docs",children:"@tevm/evm"})," - EVM execution environment and bytecode processing"]}),`
`]}),`
`,e.jsxs(s.h3,{id:"transaction--block-handling",children:["Transaction & Block Handling",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#transaction--block-handling",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/block/docs",children:"@tevm/block"})," - Block creation and manipulation utilities"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/tx/docs",children:"@tevm/tx"})," - Transaction types and handling"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/txpool/docs",children:"@tevm/txpool"})," - Transaction pool (mempool) implementation"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/receipt-manager/docs",children:"@tevm/receipt-manager"})," - Transaction receipt management"]}),`
`]}),`
`,e.jsxs(s.h3,{id:"client--communication",children:["Client & Communication",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#client--communication",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/memory-client/docs",children:"@tevm/memory-client"})," - In-memory Ethereum client implementation"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/http-client/docs",children:"@tevm/http-client"})," - HTTP client for remote Tevm nodes"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/jsonrpc/docs",children:"@tevm/jsonrpc"})," - JSON-RPC protocol implementation"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/server/docs",children:"@tevm/server"})," - Tevm server implementation"]}),`
`]}),`
`,e.jsxs(s.h3,{id:"smart-contract-tools",children:["Smart Contract Tools",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#smart-contract-tools",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/contract/docs",children:"@tevm/contract"})," - Smart contract interaction utilities"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/precompiles/docs",children:"@tevm/precompiles"})," - Precompiled contract implementations"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/predeploys/docs",children:"@tevm/predeploys"})," - Pre-deployed contract management"]}),`
`]}),`
`,e.jsxs(s.h3,{id:"utilities--helpers",children:["Utilities & Helpers",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#utilities--helpers",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/utils/docs",children:"@tevm/utils"})," - Common utilities for Ethereum data structures"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/common/docs",children:"@tevm/common"})," - Shared constants and chain configurations"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/decorators/docs",children:"@tevm/decorators"})," - Function decorators for extending client functionality"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/procedures/docs",children:"@tevm/procedures"})," - Common procedures and operations"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/rlp/docs",children:"@tevm/rlp"})," - RLP encoding/decoding utilities"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/trie/docs",children:"@tevm/trie"})," - Merkle Patricia Tree implementation"]}),`
`]}),`
`,e.jsxs(s.h3,{id:"development--error-handling",children:["Development & Error Handling",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#development--error-handling",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/errors/docs",children:"@tevm/errors"})," - Error types and handling"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/logger/docs",children:"@tevm/logger"})," - Logging functionality"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/effect/docs",children:"@tevm/effect"})," - Effect system for handling side effects"]}),`
`]}),`
`,e.jsxs(s.h3,{id:"storage--synchronization",children:["Storage & Synchronization",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#storage--synchronization",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/sync-storage-persister/docs",children:"@tevm/sync-storage-persister"})," - Storage persistence and synchronization"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/client-types/docs",children:"@tevm/client-types"})," - Type definitions for client interfaces"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/node/docs",children:"@tevm/node"})," - Node implementation and management"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/address/docs",children:"@tevm/address"})," - Ethereum address utilities and validation"]}),`
`]}),`
`,e.jsxs(s.h2,{id:"additional-resources",children:["Additional Resources",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#additional-resources",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://ethereum.org/en/developers/docs/",children:"Ethereum Development Documentation"})," - Official Ethereum docs"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://ethereum.org/en/developers/docs/evm/",children:"EVM Deep Dive"})," - Understanding the EVM"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://ethereum.org/en/developers/docs/apis/json-rpc/",children:"JSON-RPC API"})," - Standard Ethereum API"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"https://github.com/ethereumjs/ethereumjs-monorepo",children:"ethereumjs/ethereumjs-monorepo"})," - Core EVM implementation"]}),`
`]})]})}function t(i={}){const{wrapper:s}={...r(),...i.components};return s?e.jsx(s,{...i,children:e.jsx(n,{...i})}):n(i)}export{t as default,l as frontmatter};
