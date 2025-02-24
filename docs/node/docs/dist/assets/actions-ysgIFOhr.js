import{u as l,j as s}from"./index-B3fhLnWZ.js";const r={title:"@tevm/actions",description:"undefined"};function i(n){const e={a:"a",blockquote:"blockquote",code:"code",div:"div",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",li:"li",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...l(),...n.components};return s.jsxs(s.Fragment,{children:[s.jsx(e.header,{children:s.jsxs(e.h1,{id:"tevmactions",children:["@tevm/actions",s.jsx(e.a,{"aria-hidden":"true",tabIndex:"-1",href:"#tevmactions",children:s.jsx(e.div,{"data-autolink-icon":!0})})]})}),`
`,s.jsxs(e.blockquote,{children:[`
`,s.jsxs(e.p,{children:[s.jsx(e.strong,{children:"Generated API Documentation"}),": View the full API documentation in the ",s.jsx(e.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/actions/docs",children:"evmts/tevm-monorepo/packages/actions/docs"})," folder."]}),`
`]}),`
`,s.jsxs(e.p,{children:["The ",s.jsx(e.code,{children:"@tevm/actions"})," package provides a comprehensive set of actions for interacting with the Tevm client. It includes both standard Ethereum JSON-RPC methods and Tevm-specific functionality."]}),`
`,s.jsxs(e.h2,{id:"installation",children:["Installation",s.jsx(e.a,{"aria-hidden":"true",tabIndex:"-1",href:"#installation",children:s.jsx(e.div,{"data-autolink-icon":!0})})]}),`
`,s.jsx(s.Fragment,{children:s.jsx(e.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:s.jsx(e.code,{children:s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#6F42C1","--shiki-dark":"#F69D50"},children:"npm"}),s.jsx(e.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" install"}),s.jsx(e.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" @tevm/actions"})]})})})}),`
`,s.jsxs(e.h2,{id:"main-categories",children:["Main Categories",s.jsx(e.a,{"aria-hidden":"true",tabIndex:"-1",href:"#main-categories",children:s.jsx(e.div,{"data-autolink-icon":!0})})]}),`
`,s.jsxs(e.h3,{id:"base-actions",children:["Base Actions",s.jsx(e.a,{"aria-hidden":"true",tabIndex:"-1",href:"#base-actions",children:s.jsx(e.div,{"data-autolink-icon":!0})})]}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsxs(e.li,{children:[`
`,s.jsxs(e.p,{children:[s.jsx(e.strong,{children:"Call"}),": Execute EVM calls"]}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"CallHandler"}),": Execute a call against the VM"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"BaseCallParams"}),": Common parameters for call operations"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"CallResult"}),": Result of call execution"]}),`
`]}),`
`]}),`
`,s.jsxs(e.li,{children:[`
`,s.jsxs(e.p,{children:[s.jsx(e.strong,{children:"Contract"}),": Smart contract interactions"]}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"ContractHandler"}),": Execute contract calls with type safety"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"ContractParams"}),": Parameters for contract calls"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"ContractResult"}),": Result of contract execution"]}),`
`]}),`
`]}),`
`,s.jsxs(e.li,{children:[`
`,s.jsxs(e.p,{children:[s.jsx(e.strong,{children:"Deploy"}),": Contract deployment"]}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"DeployHandler"}),": Deploy contracts to the VM"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"DeployParams"}),": Parameters for contract deployment"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"DeployResult"}),": Result of deployment"]}),`
`]}),`
`]}),`
`,s.jsxs(e.li,{children:[`
`,s.jsxs(e.p,{children:[s.jsx(e.strong,{children:"State Management"}),":"]}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"DumpStateHandler"}),": Dump current VM state"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"LoadStateHandler"}),": Load a previously dumped state"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"GetAccountHandler"}),": Get account state"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"SetAccountHandler"}),": Set account state"]}),`
`]}),`
`]}),`
`]}),`
`,s.jsxs(e.h3,{id:"ethereum-json-rpc-actions",children:["Ethereum JSON-RPC Actions",s.jsx(e.a,{"aria-hidden":"true",tabIndex:"-1",href:"#ethereum-json-rpc-actions",children:s.jsx(e.div,{"data-autolink-icon":!0})})]}),`
`,s.jsx(e.p,{children:"Standard Ethereum JSON-RPC methods:"}),`
`,s.jsxs(e.h4,{id:"account--network",children:["Account & Network",s.jsx(e.a,{"aria-hidden":"true",tabIndex:"-1",href:"#account--network",children:s.jsx(e.div,{"data-autolink-icon":!0})})]}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"eth_accounts"}),": List available accounts"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"eth_chainId"}),": Get current chain ID"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"eth_coinbase"}),": Get coinbase address"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"eth_gasPrice"}),": Get current gas price"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"eth_blockNumber"}),": Get current block number"]}),`
`]}),`
`,s.jsxs(e.h4,{id:"state-reading",children:["State Reading",s.jsx(e.a,{"aria-hidden":"true",tabIndex:"-1",href:"#state-reading",children:s.jsx(e.div,{"data-autolink-icon":!0})})]}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"eth_getBalance"}),": Get account balance"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"eth_getCode"}),": Get contract code"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"eth_getStorageAt"}),": Get storage at position"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"eth_call"}),": Execute call without state changes"]}),`
`]}),`
`,s.jsxs(e.h4,{id:"block-operations",children:["Block Operations",s.jsx(e.a,{"aria-hidden":"true",tabIndex:"-1",href:"#block-operations",children:s.jsx(e.div,{"data-autolink-icon":!0})})]}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"eth_getBlockByHash"}),": Get block by hash"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"eth_getBlockByNumber"}),": Get block by number"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"eth_getBlockTransactionCountByHash"}),": Get block transaction count by hash"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"eth_getBlockTransactionCountByNumber"}),": Get block transaction count by number"]}),`
`]}),`
`,s.jsxs(e.h4,{id:"transaction-operations",children:["Transaction Operations",s.jsx(e.a,{"aria-hidden":"true",tabIndex:"-1",href:"#transaction-operations",children:s.jsx(e.div,{"data-autolink-icon":!0})})]}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"eth_getTransactionByHash"}),": Get transaction by hash"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"eth_getTransactionByBlockHashAndIndex"}),": Get transaction by block hash and index"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"eth_getTransactionByBlockNumberAndIndex"}),": Get transaction by block number and index"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"eth_estimateGas"}),": Estimate gas usage"]}),`
`]}),`
`,s.jsxs(e.h4,{id:"logs--filters",children:["Logs & Filters",s.jsx(e.a,{"aria-hidden":"true",tabIndex:"-1",href:"#logs--filters",children:s.jsx(e.div,{"data-autolink-icon":!0})})]}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"eth_getLogs"}),": Get event logs"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"eth_getFilterChanges"}),": Get filter changes"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"eth_getFilterLogs"}),": Get filter logs"]}),`
`]}),`
`,s.jsxs(e.h3,{id:"anvil-testing--development-actions",children:["Anvil (Testing & Development) Actions",s.jsx(e.a,{"aria-hidden":"true",tabIndex:"-1",href:"#anvil-testing--development-actions",children:s.jsx(e.div,{"data-autolink-icon":!0})})]}),`
`,s.jsx(e.p,{children:"Anvil-compatible actions for testing and development:"}),`
`,s.jsxs(e.h4,{id:"state-manipulation",children:["State Manipulation",s.jsx(e.a,{"aria-hidden":"true",tabIndex:"-1",href:"#state-manipulation",children:s.jsx(e.div,{"data-autolink-icon":!0})})]}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"anvil_setBalance"}),": Set account balance"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"anvil_setCode"}),": Set contract code"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"anvil_setNonce"}),": Set account nonce"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"anvil_setStorageAt"}),": Set storage at position"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"anvil_setChainId"}),": Set chain ID"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"anvil_setCoinbase"}),": Set coinbase address"]}),`
`]}),`
`,s.jsxs(e.h4,{id:"account-management",children:["Account Management",s.jsx(e.a,{"aria-hidden":"true",tabIndex:"-1",href:"#account-management",children:s.jsx(e.div,{"data-autolink-icon":!0})})]}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"anvil_impersonateAccount"}),": Impersonate an account"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"anvil_stopImpersonatingAccount"}),": Stop impersonating account"]}),`
`]}),`
`,s.jsxs(e.h4,{id:"transaction-management",children:["Transaction Management",s.jsx(e.a,{"aria-hidden":"true",tabIndex:"-1",href:"#transaction-management",children:s.jsx(e.div,{"data-autolink-icon":!0})})]}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"anvil_dropTransaction"}),": Remove transaction from pool"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"anvil_mine"}),": Mine blocks"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"anvil_automine"}),": Get/set automine status"]}),`
`]}),`
`,s.jsxs(e.h4,{id:"state-management",children:["State Management",s.jsx(e.a,{"aria-hidden":"true",tabIndex:"-1",href:"#state-management",children:s.jsx(e.div,{"data-autolink-icon":!0})})]}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"anvil_dumpState"}),": Dump current state"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"anvil_loadState"}),": Load state"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"anvil_reset"}),": Reset to initial state"]}),`
`]}),`
`,s.jsxs(e.h3,{id:"debug-actions",children:["Debug Actions",s.jsx(e.a,{"aria-hidden":"true",tabIndex:"-1",href:"#debug-actions",children:s.jsx(e.div,{"data-autolink-icon":!0})})]}),`
`,s.jsx(e.p,{children:"Debugging functionality:"}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"debug_traceCall"}),": Trace a call execution"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"debug_traceTransaction"}),": Trace a transaction execution"]}),`
`]}),`
`,s.jsxs(e.h2,{id:"usage-example",children:["Usage Example",s.jsx(e.a,{"aria-hidden":"true",tabIndex:"-1",href:"#usage-example",children:s.jsx(e.div,{"data-autolink-icon":!0})})]}),`
`,s.jsx(s.Fragment,{children:s.jsx(e.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:s.jsxs(e.code,{children:[s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" { createTevmNode } "}),s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),s.jsx(e.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" 'tevm/node'"})]}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"import"}),s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:" {"})]}),`
`,s.jsx(e.span,{className:"line",children:s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  callHandler,"})}),`
`,s.jsx(e.span,{className:"line",children:s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  contractHandler,"})}),`
`,s.jsx(e.span,{className:"line",children:s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  deployHandler,"})}),`
`,s.jsx(e.span,{className:"line",children:s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  ethCallHandler"})}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"} "}),s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"from"}),s.jsx(e.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" '@tevm/actions'"})]}),`
`,s.jsx(e.span,{className:"line","data-empty-line":!0,children:" "}),`
`,s.jsx(e.span,{className:"line",children:s.jsx(e.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Create base client"})}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),s.jsx(e.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" client"}),s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),s.jsx(e.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" createTevmNode"}),s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"()"})]}),`
`,s.jsx(e.span,{className:"line","data-empty-line":!0,children:" "}),`
`,s.jsx(e.span,{className:"line",children:s.jsx(e.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Initialize handlers"})}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),s.jsx(e.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" call"}),s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),s.jsx(e.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" callHandler"}),s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"(client)"})]}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),s.jsx(e.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" contract"}),s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),s.jsx(e.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" contractHandler"}),s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"(client)"})]}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),s.jsx(e.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" deploy"}),s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),s.jsx(e.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" deployHandler"}),s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"(client)"})]}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),s.jsx(e.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" ethCall"}),s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),s.jsx(e.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" ethCallHandler"}),s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"(client)"})]}),`
`,s.jsx(e.span,{className:"line","data-empty-line":!0,children:" "}),`
`,s.jsx(e.span,{className:"line",children:s.jsx(e.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Execute a call"})}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),s.jsx(e.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" callResult"}),s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" await"}),s.jsx(e.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" call"}),s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"({"})]}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  to: "}),s.jsx(e.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'0x123...'"}),s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:","})]}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  data: "}),s.jsx(e.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'0x456...'"}),s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:","})]}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  value: "}),s.jsx(e.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:"1000"}),s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"n"})]}),`
`,s.jsx(e.span,{className:"line",children:s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"})"})}),`
`,s.jsx(e.span,{className:"line","data-empty-line":!0,children:" "}),`
`,s.jsx(e.span,{className:"line",children:s.jsx(e.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Execute a contract call"})}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),s.jsx(e.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" contractResult"}),s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" await"}),s.jsx(e.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" contract"}),s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"({"})]}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  to: "}),s.jsx(e.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'0x123...'"}),s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:","})]}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  abi: ["}),s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"..."}),s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"],"})]}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  function: "}),s.jsx(e.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'transfer'"}),s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:","})]}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  args: ["}),s.jsx(e.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'0x456...'"}),s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:", "}),s.jsx(e.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:"1000"}),s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"n"}),s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"]"})]}),`
`,s.jsx(e.span,{className:"line",children:s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"})"})}),`
`,s.jsx(e.span,{className:"line","data-empty-line":!0,children:" "}),`
`,s.jsx(e.span,{className:"line",children:s.jsx(e.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Deploy a contract"})}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),s.jsx(e.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" deployResult"}),s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" await"}),s.jsx(e.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" deploy"}),s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"({"})]}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  bytecode: "}),s.jsx(e.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'0x...'"}),s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:","})]}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  abi: ["}),s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"..."}),s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"],"})]}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  args: ["}),s.jsx(e.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'constructor arg'"}),s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"]"})]}),`
`,s.jsx(e.span,{className:"line",children:s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"})"})}),`
`,s.jsx(e.span,{className:"line","data-empty-line":!0,children:" "}),`
`,s.jsx(e.span,{className:"line",children:s.jsx(e.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:"// Standard eth_call"})}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),s.jsx(e.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" ethCallResult"}),s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" await"}),s.jsx(e.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" ethCall"}),s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"({"})]}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  to: "}),s.jsx(e.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'0x123...'"}),s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:","})]}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  data: "}),s.jsx(e.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'0x456...'"})]}),`
`,s.jsx(e.span,{className:"line",children:s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"})"})})]})})}),`
`,s.jsxs(e.h2,{id:"error-handling",children:["Error Handling",s.jsx(e.a,{"aria-hidden":"true",tabIndex:"-1",href:"#error-handling",children:s.jsx(e.div,{"data-autolink-icon":!0})})]}),`
`,s.jsx(e.p,{children:"The package includes several error types:"}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"BlobGasLimitExceededError"}),": When blob gas limit is exceeded"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"MissingAccountError"}),": When an account doesn't exist"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.code,{children:"NoForkUrlSetError"}),": When fork URL is required but not set"]}),`
`]}),`
`,s.jsxs(e.p,{children:["All actions support a ",s.jsx(e.code,{children:"throwOnFail"})," parameter to control error handling:"]}),`
`,s.jsx(s.Fragment,{children:s.jsx(e.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:s.jsxs(e.code,{children:[s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:"const"}),s.jsx(e.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:" result"}),s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" ="}),s.jsx(e.span,{style:{color:"#D73A49","--shiki-dark":"#F47067"},children:" await"}),s.jsx(e.span,{style:{color:"#6F42C1","--shiki-dark":"#DCBDFB"},children:" call"}),s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"({"})]}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  to: "}),s.jsx(e.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:"'0x123...'"}),s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:","})]}),`
`,s.jsxs(e.span,{className:"line",children:[s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"  throwOnFail: "}),s.jsx(e.span,{style:{color:"#005CC5","--shiki-dark":"#6CB6FF"},children:"false"}),s.jsx(e.span,{style:{color:"#6A737D","--shiki-dark":"#768390"},children:" // Return errors in result instead of throwing"})]}),`
`,s.jsx(e.span,{className:"line",children:s.jsx(e.span,{style:{color:"#24292E","--shiki-dark":"#ADBAC7"},children:"})"})})]})})}),`
`,s.jsxs(e.h2,{id:"see-also",children:["See Also",s.jsx(e.a,{"aria-hidden":"true",tabIndex:"-1",href:"#see-also",children:s.jsx(e.div,{"data-autolink-icon":!0})})]}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsx(e.li,{children:s.jsx(e.a,{href:"https://ethereum.org/en/developers/docs/apis/json-rpc/",children:"Ethereum JSON-RPC Specification"})}),`
`,s.jsx(e.li,{children:s.jsx(e.a,{href:"https://book.getfoundry.sh/reference/anvil/",children:"Anvil Documentation"})}),`
`,s.jsx(e.li,{children:s.jsx(e.a,{href:"https://tevm.sh/",children:"Tevm Documentation"})}),`
`]})]})}function c(n={}){const{wrapper:e}={...l(),...n.components};return e?s.jsx(e,{...n,children:s.jsx(i,{...n})}):i(n)}export{c as default,r as frontmatter};
