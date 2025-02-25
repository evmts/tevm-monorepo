import{u as r,j as e}from"./index-BjVxOiwk.js";const a={title:"Getting Started",description:"Get started with Tevm Node - A JavaScript Ethereum Virtual Machine"};function n(i){const s={a:"a",code:"code",div:"div",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...r(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(s.header,{children:e.jsxs(s.h1,{id:"getting-started",children:["Getting Started",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#getting-started",children:e.jsx(s.div,{"data-autolink-icon":!0})})]})}),`
`,e.jsx(s.p,{children:"Tevm Node is an Ethereum Node that runs in all JavaScript environments. It's like hardhat or anvil, but provides"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"No native dependencies (runs in browser)"}),`
`,e.jsx(s.li,{children:"Connects directly to Viem or Ethers"}),`
`,e.jsx(s.li,{children:"Provides lower level control over the ethereum node"}),`
`]}),`
`,e.jsxs(s.p,{children:["If you know how to use viem or ethers, you ",e.jsx(s.a,{href:"/examples/ethers",children:"already know how to use TevmNode"})," and can get started right away."]}),`
`,e.jsx(s.p,{children:"If you don't know how to use viem or ethers, don't worry, Tevm is a great way to learn Ethereum+TypeScript."}),`
`,e.jsxs(s.h2,{id:"installation",children:["Installation",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#installation",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(e.Fragment,{children:e.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:e.jsx(s.code,{children:e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#F69D50"},children:"npm"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" install"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" tevm"})]})})})}),`
`,e.jsxs(s.h2,{id:"quickstart",children:["Quickstart",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#quickstart",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(s.p,{children:"To get started quick just use the viem api"}),`
`,e.jsx(e.Fragment,{children:e.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:e.jsxs(s.code,{children:[e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// createMemoryClient creates a viem client using in memory TevmNode as backend"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" {createMemoryClient} "}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" 'tevm'"})]}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// create a viem client using tevmNode as backend"})}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// note: tree shakable versions are available too"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" client"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" createMemoryClient"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"()"})]}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Use any viem public, wallet, or test action"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"await"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" client."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"getBlockNumber"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"()"})]}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Use powerful tevm specific actions"})}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// For example impersonate a 'from' address with tevmCall"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"await"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" client."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"tevmCall"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"({"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  to: "}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"`0x${'22'"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"repeat"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"("}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:"20"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:")"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"}`"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:","})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  from: "}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"`0x23592058122409345522058295201577228859`"})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"})"})}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// The tevm node exists on client.transport and handles json rpc requests to the transport"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" internalTevmNode"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" client.transport.tevm"})]})]})})}),`
`,e.jsxs(s.p,{children:["You can also use the tree shakeable api. See ",e.jsx(s.a,{href:"/examples/viem",children:"viem tevm docs"})]}),`
`,e.jsxs(s.h2,{id:"tevmnode",children:["TevmNode",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#tevmnode",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.p,{children:["For 95% of use cases of Tevm you will only need to know the ",e.jsx(s.a,{href:"/examples/viem",children:"viem"})," and ",e.jsx(s.a,{href:"/examples/ethers",children:"ethers"})," apis to use Tevm."]}),`
`,e.jsx(s.p,{children:"There is however a lower level API underpinning both of those APIs called TevmNode. Remember TevmNode was on our viem client earlier powering the transport."}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["TevmNode starts and manages an in-javascript ethereum node while ",e.jsx(s.a,{href:"/examples/viem",children:"viem actions"})," or ",e.jsx(s.a,{href:"/reference/actions",children:"TevmNode actions"})," are how you communicate with the node."]}),`
`,e.jsx(s.li,{children:"TevmNode actions include tree shakeable actions for the entire ethereum JSON-RPC api including Anvil/Hardhat/Ganache methods."}),`
`]}),`
`,e.jsx(e.Fragment,{children:e.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:e.jsx(s.code,{children:e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" tevmNode"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" viemClient.transport.tevm"})]})})})}),`
`,e.jsxs(s.p,{children:["We can create a TevmNode directly as well using ",e.jsx(s.code,{children:"createTevmNode"})]}),`
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
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["Learn more about the TevmNode actions api in the ",e.jsx(s.a,{href:"/reference/actions",children:"actions api reference"})]}),`
`,e.jsxs(s.li,{children:["Learn more about TevmNode internals in the ",e.jsx(s.a,{href:"/reference/node",children:"TevmNode reference"})]}),`
`]}),`
`,e.jsxs(s.h2,{id:"using-with-ethers",children:["Using with Ethers",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#using-with-ethers",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(s.p,{children:"Tevm is an EIP-1193 provider and works with any library that follows the same standared including ethers, thirdweb, ponder and many others. Though it is primarily built for viem it stays provider agnostic."}),`
`,e.jsx(e.Fragment,{children:e.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:e.jsxs(s.code,{children:[e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" { createTevmNode } "}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" 'tevm'"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" { requestEip1193 } "}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" 'tevm/decorators'"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" { BrowserProvider } "}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" 'ethers'"})]}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" node"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" createTevmNode"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"()."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"extend"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"("}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"requestEip1193"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"())"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" provider"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" new"}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" BrowserProvider"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"(node)"})]}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" block"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" await"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" provider."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"getBlockNumber"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"()"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" balance"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" await"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" provider."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"getBalance"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"("}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'0x1234...'"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:")"})]})]})})}),`
`,e.jsxs(s.h2,{id:"next-steps",children:["Next Steps",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#next-steps",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.h3,{id:"those-looking-to-learn-more-of-the-basics",children:["Those looking to learn more of the basics",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#those-looking-to-learn-more-of-the-basics",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["Move on to the ",e.jsx(s.a,{href:"/introduction/what-is-tevm-node",children:"what is tevm"}),", ",e.jsx(s.a,{href:"/introduction/why-run-ethereum-in-js",children:"why tevm"})," and ",e.jsx(s.a,{href:"/introduction/architecture-overview",children:"architecture"})," docs"]}),`
`]}),`
`,e.jsxs(s.h3,{id:"those-looking-to-play-with-tevm",children:["Those looking to play with tevm",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#those-looking-to-play-with-tevm",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["Move on to the ",e.jsx(s.a,{href:"/introduction/installation",children:"installation"})," docs"]}),`
`,e.jsxs(s.li,{children:["Example projects can be found in the ",e.jsx(s.a,{href:"asdf",children:"tevm org"})," and ",e.jsx(s.a,{href:"asdf",children:"tevm monorepo"})]}),`
`]}),`
`,e.jsxs(s.h3,{id:"those-who-want-to-use-tevm-in-a-frontend-but-dont-know-where-to-start",children:["Those who want to use Tevm in a frontend but don't know where to start.",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#those-who-want-to-use-tevm-in-a-frontend-but-dont-know-where-to-start",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.p,{children:["My recomendation is you use an ai tool like ",e.jsx(s.a,{href:"https://bolt.new",children:"bolt.new"})," or cursor"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["ask it to scaffold for you a ",e.jsx(s.code,{children:"vanilla vite"}),", ",e.jsx(s.code,{children:"react vite"}),", or ",e.jsx(s.code,{children:"sveltkit"})," app."]}),`
`,e.jsx(s.li,{children:"Krome and scaffold eth are other great starter projects"}),`
`]}),`
`,e.jsx(s.p,{children:"Usage of Tevm is the same regardless of environment"}),`
`,e.jsxs(s.h3,{id:"viem-users",children:["Viem users",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#viem-users",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(s.p,{children:"Viem users can get started and go their entire life using Tevm without learning a single new API thanks to viem's powerful Public, Wallet, and Test actions."}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["Skip straight to ",e.jsx(s.a,{href:"/examples/viem",children:"viem tevm docs"}),"."]}),`
`,e.jsx(s.li,{children:"Reference the rest of these docs if you need advanced functionality"}),`
`]}),`
`,e.jsxs(s.h3,{id:"those-wishing-to-run-tevm-on-a-server",children:["Those wishing to run Tevm on a server",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#those-wishing-to-run-tevm-on-a-server",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(s.p,{children:"Tevm offers a simple http server to run Tevm. It can also be used with hono, express, next.js, cloudflare workers, or any server framework that supports standard JavaScript requests handlers."}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["See ",e.jsx(s.a,{href:"/reference/server",children:"server"})," docs"]}),`
`]}),`
`,e.jsxs(s.h2,{id:"guides",children:["Guides",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#guides",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(s.p,{children:"Tevm offers various guides that can be useful depending on your use case."}),`
`,e.jsxs(s.h3,{id:"core-guides",children:["Core guides",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#core-guides",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(s.p,{children:"The most essential guides are core guides"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/core/create-tevm-node",children:"createTevmNode"})," goes more in depth on configuring Tevm"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/core/forking",children:"forking"})," goes more in depth on how Tevm forks and how to refork or clone tevm instances"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/core/managing-state",children:"managing state"})," explains how tevm state works, how to manipulate it, and best practices"]}),`
`]}),`
`,e.jsxs(s.h3,{id:"api-guides",children:["API guides",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#api-guides",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(s.p,{children:"In addition to the reference documentation we offer more conceptual guides for important concepts for those wanting to dive deeper."}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/api/tevm-call",children:"tevm-call"})," covers in depth the most powerful custom API for simulating and sending transactions with Tevm"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/api/json-rpc",children:"json-rpc"})," covers how to plug into Tevm with JSON-RPC. This is important if you are building tools around tevm"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/api/evm-events",children:"evm-events"})," dives into low level EVM utilities you can do to run callbacks or customize the EVM as it runs. These apis are not available in any other tools including anvil or hardhat."]}),`
`]}),`
`,e.jsxs(s.h3,{id:"advanced-guides",children:["Advanced guides",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#advanced-guides",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(s.p,{children:"Tevm supports many advanced use cases."}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/api/vm-and-submodules",children:"vm-and-submodules"})," - Dives deep into the TevmNode interface explaining it's lower level components like ",e.jsx(s.code,{children:"blockchain"}),", ",e.jsx(s.code,{children:"evm"}),", ",e.jsx(s.code,{children:"txpool"}),", ",e.jsx(s.code,{children:"statemanager"}),", ",e.jsx(s.code,{children:"common"})," and more- Dives deep into the TevmNode interface explaining it's lower level components like ",e.jsx(s.code,{children:"blockchain"}),", ",e.jsx(s.code,{children:"evm"}),", ",e.jsx(s.code,{children:"txpool"}),", ",e.jsx(s.code,{children:"statemanager"}),", ",e.jsx(s.code,{children:"common"})," and more. Go here if you want to become a Tevm master or contribute internally."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/advanced/custom-precompiles",children:"custom precompiles"})," - Covers how to write EVM contracts in JavaScript and run them. This is an advanced but extremely powerful feature only supported by Tevm. You cannot do this with Geth, Anvil, or Hardhat."]}),`
`]}),`
`,e.jsxs(s.h2,{id:"reference-documentation",children:["Reference Documentation",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#reference-documentation",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.p,{children:["Tevm is modular - install the full package with ",e.jsx(s.code,{children:"npm install tevm"})," and use packages like ",e.jsx(s.code,{children:"tevm/actions"})," or individual packages like ",e.jsx(s.code,{children:"@tevm/actions"}),". Import from specific packages:"]}),`
`,e.jsx(e.Fragment,{children:e.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:e.jsxs(s.code,{children:[e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Full package"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" { createTevmNode } "}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" 'tevm'"})]}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Individual packages"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" { createTevmNode } "}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" '@tevm/node'"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" { callHandler } "}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" '@tevm/actions'"})]})]})})}),`
`,e.jsxs(s.p,{children:["Throughout documentation we will favor the ",e.jsx(s.code,{children:"tevm"})," style of import."]}),`
`,e.jsxs(s.p,{children:[e.jsx(s.a,{href:"/api/packages",children:"For detailed API reference documentation"})," of each package, visit:"]}),`
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
`]})]})}function d(i={}){const{wrapper:s}={...r(),...i.components};return s?e.jsx(s,{...i,children:e.jsx(n,{...i})}):n(i)}export{d as default,a as frontmatter};
