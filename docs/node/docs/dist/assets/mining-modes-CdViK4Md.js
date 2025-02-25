import{u as l,j as s}from"./index-BjVxOiwk.js";const r={title:"Mining Modes",description:"Configure block production in Tevm Node"};function e(n){const i={a:"a",code:"code",div:"div",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...l(),...n.components};return s.jsxs(s.Fragment,{children:[s.jsx(i.header,{children:s.jsxs(i.h1,{id:"mining-modes",children:["Mining Modes",s.jsx(i.a,{"aria-hidden":"true",tabIndex:"-1",href:"#mining-modes",children:s.jsx(i.div,{"data-autolink-icon":!0})})]})}),`
`,s.jsx(i.p,{children:"Tevm Node provides several mining modes to control how and when blocks are produced. This flexibility allows you to simulate different network conditions and test various scenarios."}),`
`,s.jsxs(i.h2,{id:"available-mining-modes",children:["Available Mining Modes",s.jsx(i.a,{"aria-hidden":"true",tabIndex:"-1",href:"#available-mining-modes",children:s.jsx(i.div,{"data-autolink-icon":!0})})]}),`
`,s.jsxs(i.h3,{id:"auto-mining-auto",children:["Auto Mining (",s.jsx(i.code,{children:"auto"}),")",s.jsx(i.a,{"aria-hidden":"true",tabIndex:"-1",href:"#auto-mining-auto",children:s.jsx(i.div,{"data-autolink-icon":!0})})]}),`
`,s.jsx(i.p,{children:"Automatically mines a new block after each transaction."}),`
`,s.jsx(s.Fragment,{children:s.jsx(i.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:s.jsxs(i.code,{children:[s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),s.jsx(i.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" node"}),s.jsx(i.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),s.jsx(i.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" createTevmNode"}),s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"({"})]}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  miningConfig: {"})}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"    type: "}),s.jsx(i.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'auto'"})]}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  }"})}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"})"})})]})})}),`
`,s.jsx(i.p,{children:"Best for:"}),`
`,s.jsxs(i.ul,{children:[`
`,s.jsx(i.li,{children:"Quick testing and development"}),`
`,s.jsx(i.li,{children:"Immediate transaction confirmation"}),`
`,s.jsx(i.li,{children:"Simulating instant finality"}),`
`]}),`
`,s.jsxs(i.h3,{id:"interval-mining-interval",children:["Interval Mining (",s.jsx(i.code,{children:"interval"}),")",s.jsx(i.a,{"aria-hidden":"true",tabIndex:"-1",href:"#interval-mining-interval",children:s.jsx(i.div,{"data-autolink-icon":!0})})]}),`
`,s.jsx(i.p,{children:"Mines blocks at fixed time intervals, simulating real network block times."}),`
`,s.jsx(s.Fragment,{children:s.jsx(i.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:s.jsxs(i.code,{children:[s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),s.jsx(i.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" node"}),s.jsx(i.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),s.jsx(i.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" createTevmNode"}),s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"({"})]}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  miningConfig: {"})}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"    type: "}),s.jsx(i.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'interval'"}),s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:","})]}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"    interval: "}),s.jsx(i.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:"12000"}),s.jsx(i.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:" // 12 seconds, similar to Ethereum"})]}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  }"})}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"})"})})]})})}),`
`,s.jsx(i.p,{children:"Best for:"}),`
`,s.jsxs(i.ul,{children:[`
`,s.jsx(i.li,{children:"Testing time-dependent logic"}),`
`,s.jsx(i.li,{children:"Simulating realistic network conditions"}),`
`,s.jsx(i.li,{children:"Handling pending transaction queues"}),`
`]}),`
`,s.jsxs(i.h3,{id:"manual-mining-manual",children:["Manual Mining (",s.jsx(i.code,{children:"manual"}),")",s.jsx(i.a,{"aria-hidden":"true",tabIndex:"-1",href:"#manual-mining-manual",children:s.jsx(i.div,{"data-autolink-icon":!0})})]}),`
`,s.jsx(i.p,{children:"Only mines blocks when explicitly requested, giving you complete control over block production."}),`
`,s.jsx(s.Fragment,{children:s.jsx(i.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:s.jsxs(i.code,{children:[s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),s.jsx(i.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" node"}),s.jsx(i.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),s.jsx(i.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" createTevmNode"}),s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"({"})]}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  miningConfig: {"})}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"    type: "}),s.jsx(i.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'manual'"})]}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  }"})}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"})"})}),`
`,s.jsx(i.span,{className:"line","data-empty-line":!0,children:" "}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Later, mine blocks manually"})}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"await"}),s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" node."}),s.jsx(i.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"mine"}),s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"()"})]})]})})}),`
`,s.jsx(i.p,{children:"Best for:"}),`
`,s.jsxs(i.ul,{children:[`
`,s.jsx(i.li,{children:"Complex test scenarios"}),`
`,s.jsx(i.li,{children:"Precise control over block timing"}),`
`,s.jsx(i.li,{children:"Testing mempool behavior"}),`
`]}),`
`,s.jsxs(i.h3,{id:"gas-based-mining-gas",children:["Gas-Based Mining (",s.jsx(i.code,{children:"gas"}),")",s.jsx(i.a,{"aria-hidden":"true",tabIndex:"-1",href:"#gas-based-mining-gas",children:s.jsx(i.div,{"data-autolink-icon":!0})})]}),`
`,s.jsx(i.p,{children:"Mines a new block when the accumulated gas usage reaches a specified threshold."}),`
`,s.jsx(s.Fragment,{children:s.jsx(i.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:s.jsxs(i.code,{children:[s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),s.jsx(i.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" node"}),s.jsx(i.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),s.jsx(i.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" createTevmNode"}),s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"({"})]}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  miningConfig: {"})}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"    type: "}),s.jsx(i.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'gas'"}),s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:","})]}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"    gasLimit: "}),s.jsx(i.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:"15000000"}),s.jsx(i.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:" // Similar to Ethereum block gas limit"})]}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  }"})}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"})"})})]})})}),`
`,s.jsx(i.p,{children:"Best for:"}),`
`,s.jsxs(i.ul,{children:[`
`,s.jsx(i.li,{children:"Testing gas-dependent behavior"}),`
`,s.jsx(i.li,{children:"Simulating block fullness scenarios"}),`
`,s.jsx(i.li,{children:"Performance testing with varying load"}),`
`]}),`
`,s.jsxs(i.h2,{id:"changing-mining-modes",children:["Changing Mining Modes",s.jsx(i.a,{"aria-hidden":"true",tabIndex:"-1",href:"#changing-mining-modes",children:s.jsx(i.div,{"data-autolink-icon":!0})})]}),`
`,s.jsx(i.p,{children:"You can change the mining mode after node creation:"}),`
`,s.jsx(s.Fragment,{children:s.jsx(i.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:s.jsxs(i.code,{children:[s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Switch to interval mining"})}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"await"}),s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" node."}),s.jsx(i.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"setMiningConfig"}),s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"({"})]}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  type: "}),s.jsx(i.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'interval'"}),s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:","})]}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  interval: "}),s.jsx(i.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:"5000"}),s.jsx(i.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:" // 5 seconds"})]}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"})"})}),`
`,s.jsx(i.span,{className:"line","data-empty-line":!0,children:" "}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Switch to manual mining"})}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"await"}),s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" node."}),s.jsx(i.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"setMiningConfig"}),s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"({"})]}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  type: "}),s.jsx(i.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'manual'"})]}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"})"})})]})})}),`
`,s.jsxs(i.h2,{id:"best-practices",children:["Best Practices",s.jsx(i.a,{"aria-hidden":"true",tabIndex:"-1",href:"#best-practices",children:s.jsx(i.div,{"data-autolink-icon":!0})})]}),`
`,s.jsxs(i.ol,{children:[`
`,s.jsxs(i.li,{children:[`
`,s.jsx(i.strong,{children:"Choose the Right Mode"}),`
`,s.jsxs(i.ul,{children:[`
`,s.jsxs(i.li,{children:["Use ",s.jsx(i.code,{children:"auto"})," for simple testing and development"]}),`
`,s.jsxs(i.li,{children:["Use ",s.jsx(i.code,{children:"interval"})," or ",s.jsx(i.code,{children:"gas"})," for more realistic scenarios"]}),`
`,s.jsxs(i.li,{children:["Use ",s.jsx(i.code,{children:"manual"})," for precise control in tests"]}),`
`]}),`
`]}),`
`,s.jsxs(i.li,{children:[`
`,s.jsx(i.strong,{children:"Consider Performance"}),`
`,s.jsxs(i.ul,{children:[`
`,s.jsxs(i.li,{children:[s.jsx(i.code,{children:"auto"})," mining can be resource-intensive with many transactions"]}),`
`,s.jsxs(i.li,{children:[s.jsx(i.code,{children:"interval"})," mining might delay transaction processing"]}),`
`,s.jsxs(i.li,{children:[s.jsx(i.code,{children:"gas"})," mining helps simulate network congestion"]}),`
`]}),`
`]}),`
`,s.jsxs(i.li,{children:[`
`,s.jsx(i.strong,{children:"Testing Considerations"}),`
`,s.jsxs(i.ul,{children:[`
`,s.jsxs(i.li,{children:["Test time-sensitive logic with ",s.jsx(i.code,{children:"interval"})," mining"]}),`
`,s.jsxs(i.li,{children:["Use ",s.jsx(i.code,{children:"manual"})," mining for deterministic test cases"]}),`
`,s.jsx(i.li,{children:"Simulate network conditions with appropriate intervals"}),`
`]}),`
`]}),`
`]}),`
`,s.jsxs(i.h2,{id:"example-testing-different-mining-modes",children:["Example: Testing Different Mining Modes",s.jsx(i.a,{"aria-hidden":"true",tabIndex:"-1",href:"#example-testing-different-mining-modes",children:s.jsx(i.div,{"data-autolink-icon":!0})})]}),`
`,s.jsx(s.Fragment,{children:s.jsx(i.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:s.jsxs(i.code,{children:[s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" { createTevmNode } "}),s.jsx(i.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),s.jsx(i.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" 'tevm'"})]}),`
`,s.jsx(i.span,{className:"line","data-empty-line":!0,children:" "}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Auto mining for quick tests"})}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),s.jsx(i.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" autoNode"}),s.jsx(i.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),s.jsx(i.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" createTevmNode"}),s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"({"})]}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  miningConfig: { type: "}),s.jsx(i.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'auto'"}),s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" }"})]}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"})"})}),`
`,s.jsx(i.span,{className:"line","data-empty-line":!0,children:" "}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Interval mining for realistic scenarios"})}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),s.jsx(i.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" intervalNode"}),s.jsx(i.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),s.jsx(i.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" createTevmNode"}),s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"({"})]}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  miningConfig: {"})}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"    type: "}),s.jsx(i.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'interval'"}),s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:","})]}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"    interval: "}),s.jsx(i.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:"12000"})]}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  }"})}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"})"})}),`
`,s.jsx(i.span,{className:"line","data-empty-line":!0,children:" "}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Manual mining for controlled tests"})}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),s.jsx(i.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" manualNode"}),s.jsx(i.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),s.jsx(i.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" createTevmNode"}),s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"({"})]}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  miningConfig: { type: "}),s.jsx(i.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'manual'"}),s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" }"})]}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"})"})}),`
`,s.jsx(i.span,{className:"line","data-empty-line":!0,children:" "}),`
`,s.jsx(i.span,{className:"line",children:s.jsx(i.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Test transaction processing"})}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"await"}),s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" autoNode."}),s.jsx(i.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"sendTransaction"}),s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"({"}),s.jsx(i.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"..."}),s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"}) "}),s.jsx(i.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Mines immediately"})]}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"await"}),s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" intervalNode."}),s.jsx(i.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"sendTransaction"}),s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"({"}),s.jsx(i.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"..."}),s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"}) "}),s.jsx(i.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Mines after interval"})]}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"await"}),s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" manualNode."}),s.jsx(i.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"sendTransaction"}),s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"({"}),s.jsx(i.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"..."}),s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"}) "}),s.jsx(i.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Stays pending until manual mine"})]}),`
`,s.jsxs(i.span,{className:"line",children:[s.jsx(i.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"await"}),s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" manualNode."}),s.jsx(i.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:"mine"}),s.jsx(i.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"() "}),s.jsx(i.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Now the transaction is mined"})]})]})})}),`
`,s.jsxs(i.h2,{id:"related-topics",children:["Related Topics",s.jsx(i.a,{"aria-hidden":"true",tabIndex:"-1",href:"#related-topics",children:s.jsx(i.div,{"data-autolink-icon":!0})})]}),`
`,s.jsxs(i.ul,{children:[`
`,s.jsxs(i.li,{children:[s.jsx(i.a,{href:"/Users/williamcory/tevm-monorepo/docs/node/docs/pages/advanced/txpool",children:"Transaction Pool"})," - Understanding pending transaction handling"]}),`
`,s.jsxs(i.li,{children:[s.jsx(i.a,{href:"/Users/williamcory/tevm-monorepo/docs/node/docs/pages/advanced/performance-profiler",children:"Performance Optimization"})," - Tuning mining for better performance"]}),`
`,s.jsxs(i.li,{children:[s.jsx(i.a,{href:"/Users/williamcory/tevm-monorepo/docs/node/docs/pages/api/methods#block-methods",children:"Block Management"})," - Low-level block control"]}),`
`]})]})}function d(n={}){const{wrapper:i}={...l(),...n.components};return i?s.jsx(i,{...n,children:s.jsx(e,{...n})}):e(n)}export{d as default,r as frontmatter};
