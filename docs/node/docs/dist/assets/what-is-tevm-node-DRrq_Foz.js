import{d as r,j as e}from"./index-gf6yndvA.js";const t={title:"What is Tevm Node?",description:"Overview of Tevm Node - A JavaScript Ethereum Virtual Machine"};function i(n){const s={a:"a",code:"code",div:"div",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...r(),...n.components};return e.jsxs(e.Fragment,{children:[e.jsx(s.header,{children:e.jsxs(s.h1,{id:"what-is-tevm-node",children:["What is Tevm Node?",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#what-is-tevm-node",children:e.jsx(s.div,{"data-autolink-icon":!0})})]})}),`
`,e.jsx(s.p,{children:"Tevm Node is an in-browser & Node.js-compatible Ethereum Virtual Machine (EVM) environment. It provides a complete Ethereum execution environment, powered by JavaScript, that you can run:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"In Node.js"})," for local development and testing"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"In the Browser"})," for advanced user experiences (offline simulation, real-time testing)"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"In Deno, Bun"}),", or any modern JavaScript runtime"]}),`
`]}),`
`,e.jsxs(s.h2,{id:"key-features",children:["Key Features",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#key-features",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Forking:"})," Fork from any EVM-compatible network (mainnet, testnet) with efficient caching"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Transaction Pool:"})," Track and manage pending transactions locally"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Flexible Mining:"})," Choose between automatic, interval-based, manual, or gas-limit-based mining"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Zero Native Dependencies:"})," Works seamlessly in browsers and JavaScript runtimes"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Highly Extensible:"})," Customize the VM, add precompiles, handle receipts, and more"]}),`
`]}),`
`,e.jsxs(s.h2,{id:"quick-example",children:["Quick Example",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#quick-example",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(s.p,{children:"Tevm is a viem transport along with a viem extension to add the functionality of running an in memory node to viem."}),`
`,e.jsxs(s.p,{children:["The tevmNode can be seen via ",e.jsx(s.code,{children:"client.transport.tevm"})]}),`
`,e.jsx(e.Fragment,{children:e.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:e.jsxs(s.code,{children:[e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" { createMemoryClient, http } "}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" 'tevm'"})]}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" client"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" createMemoryClient"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"({"})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  fork: {"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"    transport: "}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"http"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"("}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'https://mainnet.optimism.io'"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:")"})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  }"})}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"})"})}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" tevmNode"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" client.transport.tevm"})]}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" vm"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" await"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" tevmNode."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"getVm"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"()"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"console."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"log"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"("}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"await"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" vm.blockchain."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"getBlockByTag"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"("}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'latest'"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"))"})]})]})})}),`
`,e.jsx(s.p,{children:"It is not recomended to interact directly with the TevmNode but to instead use the viem actions api along with custom tevm actions."}),`
`,e.jsxs(s.h2,{id:"why-tevm-node",children:["Why Tevm Node?",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#why-tevm-node",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Browser & Local Execution:"})," Improved latency and advanced debugging capabilities"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Optimistic Updates:"})," Preview transaction effects before on-chain confirmation"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Lightweight:"})," Minimal overhead compared to full Ethereum nodes"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Network Independent:"})," Test and develop without real network constraints"]}),`
`]}),`
`,e.jsxs(s.h2,{id:"why-viem",children:["Why viem",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#why-viem",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.p,{children:["Tevm minimizes it's api surface and is easy to use because it ",e.jsx(s.a,{href:"/Users/williamcory/tevm-monorepo/docs/node/docs/pages/getting-started/viem",children:"uses viem"})," as it's API rather than forcing users to learn a bespoke api. If you know viem you already know ethers."]}),`
`,e.jsxs(s.p,{children:["Note: ",e.jsx(s.a,{href:"/Users/williamcory/tevm-monorepo/docs/node/docs/pages/getting-started/ethers",children:"ethers is also supported"})]}),`
`,e.jsxs(s.h2,{id:"next-steps",children:["Next Steps",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#next-steps",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"/why-run-ethereum-in-js",children:"Why JavaScript for Ethereum?"})}),`
`,e.jsx(s.li,{children:e.jsx(s.a,{href:"/architecture-overview",children:"Architecture Overview"})}),`
`]})]})}function l(n={}){const{wrapper:s}={...r(),...n.components};return s?e.jsx(s,{...n,children:e.jsx(i,{...n})}):i(n)}export{l as default,t as frontmatter};
