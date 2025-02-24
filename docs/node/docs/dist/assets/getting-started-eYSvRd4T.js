import{u as r,j as e}from"./index-BR4JtVyE.js";const a={title:"Getting Started",description:"Get started with Tevm Node - A JavaScript Ethereum Virtual Machine"};function n(i){const s={a:"a",code:"code",div:"div",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...r(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(s.header,{children:e.jsxs(s.h1,{id:"getting-started",children:["Getting Started",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#getting-started",children:e.jsx(s.div,{"data-autolink-icon":!0})})]})}),`
`,e.jsx(s.p,{children:"Welcome to Tevm Node! This guide will help you get started with running Ethereum in JavaScript."}),`
`,e.jsxs(s.h2,{id:"installation",children:["Installation",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#installation",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(e.Fragment,{children:e.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:e.jsx(s.code,{children:e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#F69D50"},children:"npm"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" install"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" tevm"})]})})})}),`
`,e.jsxs(s.h2,{id:"usage-examples",children:["Usage Examples",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#usage-examples",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.h3,{id:"basic-usage-with-tevm-node",children:["Basic Usage with Tevm Node",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#basic-usage-with-tevm-node",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(e.Fragment,{children:e.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:e.jsxs(s.code,{children:[e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" { createTevmNode } "}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" 'tevm'"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" { callHandler, setAccountHandler, getAccountHandler } "}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" 'tevm/actions'"})]}),`
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
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"await"}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" setAccountHandler"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"(node)({"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  address: "}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'0x1234567890123456789012345678901234567890'"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:","})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  balance: "}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:"1000000000000000000"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"n"}),e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:" // 1 ETH"})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"})"})}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Get account state"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" account"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" await"}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" getAccountHandler"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"(node)({"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  address: "}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'0x1234567890123456789012345678901234567890'"})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"})"})})]})})}),`
`,e.jsxs(s.h3,{id:"using-with-viem",children:["Using with Viem",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#using-with-viem",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(e.Fragment,{children:e.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:e.jsxs(s.code,{children:[e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" { createMemoryClient, http } "}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" 'tevm'"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" { optimism } "}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" 'tevm/common'"})]}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" client"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" createMemoryClient"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"({"})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  fork: {"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"    transport: "}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"http"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"("}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'https://mainnet.optimism.io'"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"),"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"    blockTag: "}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'latest'"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:","})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  },"})}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  common: optimism,"})}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"})"})}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Use viem's public actions"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" block"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" await"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" client."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"getBlock"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"({ blockTag: "}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'latest'"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" })"})]}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Mix with Tevm actions"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"await"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" client."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"tevmSetAccount"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"({"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  address: "}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'0x1234567890123456789012345678901234567890'"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:","})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  balance: "}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:"1000000000000000000"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"n"})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"})"})})]})})}),`
`,e.jsxs(s.h3,{id:"using-with-ethers",children:["Using with Ethers",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#using-with-ethers",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(e.Fragment,{children:e.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:e.jsxs(s.code,{children:[e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" { createTevmNode } "}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" 'tevm'"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" { requestEip1193 } "}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" 'tevm/decorators'"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" { BrowserProvider } "}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" 'ethers'"})]}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" node"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" createTevmNode"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"()."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"extend"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"("}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"requestEip1193"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"())"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" provider"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" new"}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" BrowserProvider"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"(node)"})]}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" block"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" await"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" provider."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"getBlockNumber"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"()"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" balance"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" await"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" provider."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"getBalance"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"("}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'0x1234...'"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:")"})]})]})})}),`
`,e.jsxs(s.h2,{id:"core-concepts",children:["Core Concepts",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#core-concepts",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.h3,{id:"1-node-creation--configuration",children:["1. Node Creation & Configuration",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#1-node-creation--configuration",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/core/create-tevm-node",children:"Creating a Node"})," - Basic setup and configuration"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/core/tevm-node-interface",children:"Node Interface"})," - Core API surface"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/core/mining-modes",children:"Mining Modes"})," - Configure block production:",`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"auto"}),": Mine on every transaction"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"interval"}),": Mine at fixed intervals"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"manual"}),": Explicit mining control"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.code,{children:"gas"}),": Mine based on gas usage"]}),`
`]}),`
`]}),`
`]}),`
`,e.jsxs(s.h3,{id:"2-state-management",children:["2. State Management",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#2-state-management",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/core/forking",children:"Forking Networks"})," - Fork from any EVM chain"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/core/managing-state",children:"Managing State"})," - Handle accounts and storage"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/advanced/txpool",children:"Transaction Pool"})," - Manage pending transactions"]}),`
`]}),`
`,e.jsxs(s.h3,{id:"3-api-integration",children:["3. API Integration",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#3-api-integration",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/api/json-rpc",children:"JSON-RPC Support"})," - Standard Ethereum JSON-RPC"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/reference/contract",children:"Contract Interaction"})," - Smart contract utilities"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/api/evm-events",children:"Events & Logging"})," - Debug and trace execution"]}),`
`]}),`
`,e.jsxs(s.h2,{id:"advanced-features",children:["Advanced Features",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#advanced-features",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/advanced/custom-precompiles",children:"Custom Precompiles"})," - Extend EVM functionality"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/advanced/performance-profiler",children:"Performance Optimization"})," - Profiling and tuning"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/core/forking#reforking",children:"Reforking Strategies"})," - Efficient state management"]}),`
`]}),`
`,e.jsxs(s.h2,{id:"package-documentation",children:["Package Documentation",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#package-documentation",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.p,{children:["Tevm is modular - install the full package with ",e.jsx(s.code,{children:"npm install tevm"})," or individual packages like ",e.jsx(s.code,{children:"@tevm/actions"}),". Import from specific packages:"]}),`
`,e.jsx(e.Fragment,{children:e.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:e.jsxs(s.code,{children:[e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Full package"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" { createTevmNode } "}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" 'tevm'"})]}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Individual packages"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" { createTevmNode } "}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" '@tevm/node'"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" { callHandler } "}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" '@tevm/actions'"})]})]})})}),`
`,e.jsxs(s.p,{children:["See our ",e.jsx(s.a,{href:"/api/packages",children:"Package Reference"})," for detailed documentation of each module."]}),`
`,e.jsxs(s.h2,{id:"reference-documentation",children:["Reference Documentation",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#reference-documentation",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(s.p,{children:"For detailed API reference documentation of each package, visit:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"/reference/actions",children:"@tevm/actions"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"/reference/address",children:"@tevm/address"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"/reference/block",children:"@tevm/block"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"/reference/blockchain",children:"@tevm/blockchain"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"/reference/common",children:"@tevm/common"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"/reference/contract",children:"@tevm/contract"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"/reference/decorators",children:"@tevm/decorators"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"/reference/evm",children:"@tevm/evm"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"/reference/memory-client",children:"@tevm/memory-client"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"/reference/receipt-manager",children:"@tevm/receipt-manager"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"/reference/state",children:"@tevm/state"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"/reference/tx",children:"@tevm/tx"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"/reference/txpool",children:"@tevm/txpool"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"/reference/utils",children:"@tevm/utils"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"/reference/vm",children:"@tevm/vm"})}),`
`]}),`
`,e.jsxs(s.h2,{id:"additional-resources",children:["Additional Resources",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#additional-resources",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://ethereum.org/developers",children:"Ethereum Developer Documentation"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://ethereum.org/developers/docs/evm",children:"EVM Deep Dive"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://ethereum.org/developers/docs/apis/json-rpc",children:"JSON-RPC Specification"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo",children:"GitHub Repository"})}),`
`]})]})}function c(i={}){const{wrapper:s}={...r(),...i.components};return s?e.jsx(s,{...i,children:e.jsx(n,{...i})}):n(i)}export{c as default,a as frontmatter};
