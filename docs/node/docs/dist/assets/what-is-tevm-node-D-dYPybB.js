import{u as r,j as e}from"./index-CZjtPKYw.js";const a={title:"What is Tevm Node?",description:"Overview of tevm"};function i(n){const s={a:"a",code:"code",div:"div",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...r(),...n.components};return e.jsxs(e.Fragment,{children:[e.jsx(s.header,{children:e.jsxs(s.h1,{id:"what-is-tevm-node",children:["What is Tevm Node?",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#what-is-tevm-node",children:e.jsx(s.div,{"data-autolink-icon":!0})})]})}),`
`,e.jsx(s.p,{children:"Tevm Node is an in-browser & Node.js-compatible Ethereum Node. It provides a complete Ethereum Virtual Machine (EVM) execution environment, powered by JavaScript, that you can run:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"In Node.js"})," for local or CI testing."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"In the Browser"})," for advanced user experiences (offline, real-time simulation, etc.)."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"In Deno, Bun"}),", or any modern JS environment."]}),`
`]}),`
`,e.jsxs(s.h2,{id:"key-features",children:["Key Features",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#key-features",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Forking:"})," Simulate mainnet or testnet state from a live RPC, similar to Hardhat or Anvil but running in browser and more functionality."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"TxPool (Mempool):"})," Keep track of unmined transactions locally."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Mining Config:"})," Choose between auto mining, interval-based mining, manual, or gas-limit-based mining."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Zero dependencies on native modules"})," – works seamlessly in the browser."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Extendable:"})," Hook into the VM, custom precompiles, receipts, and more."]}),`
`]}),`
`,e.jsxs(s.h2,{id:"hello-world-example",children:["Hello World Example",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#hello-world-example",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.p,{children:["This example forks optimism then reads block data using ",e.jsx(s.code,{children:"vm.blockchain"})]}),`
`,e.jsx(e.Fragment,{children:e.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:e.jsxs(s.code,{children:[e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" { createTevmNode, http } "}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" 'tevm'"})]}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Create a node that forks from Optimism"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" node"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" createTevmNode"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"({"})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  fork: {"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"    transport: "}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"http"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"("}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'https://mainnet.optimism.io'"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:")"})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  }"})}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"})"})}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" vm"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" await"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" node."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"getVm"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"()"})]}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"console."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"log"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"("}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"await"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" vm.blockchain."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"getBlockByTag"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"("}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'latest'"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"))"})]})]})})}),`
`,e.jsxs(s.h2,{id:"motivations--why-tevm-node",children:["Motivations / Why Tevm Node",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#motivations--why-tevm-node",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Browser/Local Execution"})," for improved latency & advanced debugging."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Optimistic updates"}),": Inspect tx side effects before on-chain mining."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Lightweight"}),": Slashes overhead vs. running a full geth or anvil node."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Network independence"}),": Freed from real chain constraints in your applications."]}),`
`]}),`
`,e.jsxs(s.h2,{id:"next-steps",children:["Next Steps",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#next-steps",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"/why-run-ethereum-in-js",children:"Why run Ethereum in JavaScript?"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"/installation",children:"Installation & Quickstart"})}),`
`]})]})}function t(n={}){const{wrapper:s}={...r(),...n.components};return s?e.jsx(s,{...n,children:e.jsx(i,{...n})}):i(n)}export{t as default,a as frontmatter};
