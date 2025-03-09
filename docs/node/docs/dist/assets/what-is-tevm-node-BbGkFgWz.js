import{d as r,j as e}from"./index-BXvb5I4-.js";const l={title:"What is Tevm Node?",description:"Overview of Tevm Node - A JavaScript Ethereum Virtual Machine"};function i(s){const n={a:"a",code:"code",div:"div",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...r(),...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(n.header,{children:e.jsxs(n.h1,{id:"what-is-tevm-node",children:["What is Tevm Node?",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#what-is-tevm-node",children:e.jsx(n.div,{"data-autolink-icon":!0})})]})}),`
`,e.jsx(n.p,{children:"Tevm Node is an in-browser & Node.js-compatible Ethereum Virtual Machine (EVM) environment. It provides a complete Ethereum execution environment, powered by JavaScript, that you can run:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"In Node.js"})," for local development and testing"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"In the Browser"})," for advanced user experiences (offline simulation, real-time testing)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"In Deno, Bun"}),", or any modern JavaScript runtime"]}),`
`]}),`
`,e.jsxs(n.h2,{id:"key-features",children:["Key Features",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#key-features",children:e.jsx(n.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Forking:"})," Fork from any EVM-compatible network (mainnet, testnet) with efficient caching"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Transaction Pool:"})," Track and manage pending transactions locally"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Flexible Mining:"})," Choose between automatic, interval-based, manual, or gas-limit-based mining"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Zero Native Dependencies:"})," Works seamlessly in browsers and JavaScript runtimes"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Highly Extensible:"})," Customize the VM, add precompiles, handle receipts, and more"]}),`
`]}),`
`,e.jsxs(n.h2,{id:"quick-example",children:["Quick Example",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#quick-example",children:e.jsx(n.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(e.Fragment,{children:e.jsx(n.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:e.jsxs(n.code,{children:[e.jsxs(n.span,{className:"line",children:[e.jsx(n.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" { createTevmNode, http } "}),e.jsx(n.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),e.jsx(n.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" 'tevm'"})]}),`
`,e.jsx(n.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsx(n.span,{className:"line",children:e.jsx(n.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Create a node that forks from Optimism"})}),`
`,e.jsxs(n.span,{className:"line",children:[e.jsx(n.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(n.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" node"}),e.jsx(n.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(n.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" createTevmNode"}),e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"({"})]}),`
`,e.jsx(n.span,{className:"line",children:e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  fork: {"})}),`
`,e.jsxs(n.span,{className:"line",children:[e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"    transport: "}),e.jsx(n.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"http"}),e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"("}),e.jsx(n.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'https://mainnet.optimism.io'"}),e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:")"})]}),`
`,e.jsx(n.span,{className:"line",children:e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  }"})}),`
`,e.jsx(n.span,{className:"line",children:e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"})"})}),`
`,e.jsx(n.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsxs(n.span,{className:"line",children:[e.jsx(n.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(n.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" vm"}),e.jsx(n.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(n.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" await"}),e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" node."}),e.jsx(n.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"getVm"}),e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"()"})]}),`
`,e.jsxs(n.span,{className:"line",children:[e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"console."}),e.jsx(n.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"log"}),e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"("}),e.jsx(n.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"await"}),e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" vm.blockchain."}),e.jsx(n.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"getBlockByTag"}),e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"("}),e.jsx(n.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'latest'"}),e.jsx(n.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"))"})]})]})})}),`
`,e.jsxs(n.h2,{id:"why-tevm-node",children:["Why Tevm Node?",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#why-tevm-node",children:e.jsx(n.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Browser & Local Execution:"})," Improved latency and advanced debugging capabilities"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Optimistic Updates:"})," Preview transaction effects before on-chain confirmation"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Lightweight:"})," Minimal overhead compared to full Ethereum nodes"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Network Independent:"})," Test and develop without real network constraints"]}),`
`]}),`
`,e.jsxs(n.h2,{id:"important-note",children:["Important Note",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#important-note",children:e.jsx(n.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(n.p,{children:"Tevm Node is designed primarily for development, testing, and simulation. While it implements the full EVM specification, it is not recommended for production mainnet validation or as a replacement for full consensus nodes."}),`
`,e.jsxs(n.h2,{id:"next-steps",children:["Next Steps",e.jsx(n.a,{"aria-hidden":"true",tabIndex:"-1",href:"#next-steps",children:e.jsx(n.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"/why-run-ethereum-in-js",children:"Why JavaScript for Ethereum?"})}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"/architecture-overview",children:"Architecture Overview"})}),`
`]})]})}function t(s={}){const{wrapper:n}={...r(),...s.components};return n?e.jsx(n,{...s,children:e.jsx(i,{...s})}):i(s)}export{t as default,l as frontmatter};
