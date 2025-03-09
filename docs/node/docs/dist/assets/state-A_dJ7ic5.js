import{d as n,j as e}from"./index-DhJuaQ1e.js";const r={title:"@tevm/state",description:"undefined"};function s(a){const t={a:"a",code:"code",div:"div",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",li:"li",p:"p",pre:"pre",span:"span",ul:"ul",...n(),...a.components};return e.jsxs(e.Fragment,{children:[e.jsx(t.header,{children:e.jsxs(t.h1,{id:"tevmstate",children:["@tevm/state",e.jsx(t.a,{"aria-hidden":"true",tabIndex:"-1",href:"#tevmstate",children:e.jsx(t.div,{"data-autolink-icon":!0})})]})}),`
`,e.jsxs(t.p,{children:["The ",e.jsx(t.code,{children:"@tevm/state"})," package provides a robust state management system for Tevm, handling Ethereum account states, contract storage, and state transitions. It offers both synchronous and asynchronous APIs for managing the EVM state."]}),`
`,e.jsxs(t.h2,{id:"installation",children:["Installation",e.jsx(t.a,{"aria-hidden":"true",tabIndex:"-1",href:"#installation",children:e.jsx(t.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(e.Fragment,{children:e.jsx(t.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:e.jsx(t.code,{children:e.jsxs(t.span,{className:"line",children:[e.jsx(t.span,{style:{color:"#6F42C1","--shiki-dark":"#F69D50"},children:"npm"}),e.jsx(t.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" install"}),e.jsx(t.span,{style:{color:"#032F62","--shiki-dark":"#96D0FF"},children:" @tevm/state"})]})})})}),`
`,e.jsxs(t.h2,{id:"overview",children:["Overview",e.jsx(t.a,{"aria-hidden":"true",tabIndex:"-1",href:"#overview",children:e.jsx(t.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(t.p,{children:"The state package is responsible for:"}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsx(t.li,{children:"Managing account states (balance, nonce, code, storage)"}),`
`,e.jsx(t.li,{children:"Handling state transitions and checkpoints"}),`
`,e.jsx(t.li,{children:"Caching and persistence of state data"}),`
`,e.jsx(t.li,{children:"Supporting forked chain states"}),`
`,e.jsx(t.li,{children:"Providing efficient state access and modification"}),`
`]}),`
`,e.jsxs(t.h2,{id:"api-reference",children:["API Reference",e.jsx(t.a,{"aria-hidden":"true",tabIndex:"-1",href:"#api-reference",children:e.jsx(t.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(t.h3,{id:"enumerations",children:["Enumerations",e.jsx(t.a,{"aria-hidden":"true",tabIndex:"-1",href:"#enumerations",children:e.jsx(t.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/enumerations/CacheType.md",children:"CacheType"})," - Types of caching mechanisms"]}),`
`]}),`
`,e.jsxs(t.h3,{id:"core-types",children:["Core Types",e.jsx(t.a,{"aria-hidden":"true",tabIndex:"-1",href:"#core-types",children:e.jsx(t.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(t.h4,{id:"state-management",children:["State Management",e.jsx(t.a,{"aria-hidden":"true",tabIndex:"-1",href:"#state-management",children:e.jsx(t.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/interfaces/StateManager.md",children:"StateManager"})," - Main interface for state operations"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/type-aliases/BaseState.md",children:"BaseState"})," - Core state data structure"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/type-aliases/TevmState.md",children:"TevmState"})," - Tevm-specific state representation"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/type-aliases/StateAction.md",children:"StateAction"})," - Type for state modification actions"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/type-aliases/StateOptions.md",children:"StateOptions"})," - State configuration options"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/type-aliases/StateRoots.md",children:"StateRoots"})," - State roots mapping"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/type-aliases/ParameterizedTevmState.md",children:"ParameterizedTevmState"})," - Parameterized state type"]}),`
`]}),`
`,e.jsxs(t.h4,{id:"storage-types",children:["Storage Types",e.jsx(t.a,{"aria-hidden":"true",tabIndex:"-1",href:"#storage-types",children:e.jsx(t.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/interfaces/AccountStorage.md",children:"AccountStorage"})," - Account storage structure"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/interfaces/ParameterizedAccountStorage.md",children:"ParameterizedAccountStorage"})," - Parameterized account storage interface"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/type-aliases/SerializableTevmState.md",children:"SerializableTevmState"})," - Serializable state format"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/interfaces/ForkOptions.md",children:"ForkOptions"})," - Options for forking state"]}),`
`]}),`
`,e.jsxs(t.h4,{id:"caching",children:["Caching",e.jsx(t.a,{"aria-hidden":"true",tabIndex:"-1",href:"#caching",children:e.jsx(t.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/type-aliases/StateCache.md",children:"StateCache"})," - State caching structure"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/classes/AccountCache.md",children:"AccountCache"})," - Account-level cache"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/classes/ContractCache.md",children:"ContractCache"})," - Contract-level cache"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/classes/StorageCache.md",children:"StorageCache"})," - Storage-level cache"]}),`
`]}),`
`,e.jsxs(t.h3,{id:"core-functions",children:["Core Functions",e.jsx(t.a,{"aria-hidden":"true",tabIndex:"-1",href:"#core-functions",children:e.jsx(t.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(t.h4,{id:"state-creation-and-management",children:["State Creation and Management",e.jsx(t.a,{"aria-hidden":"true",tabIndex:"-1",href:"#state-creation-and-management",children:e.jsx(t.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/functions/createStateManager.md",children:"createStateManager"})," - Creates a new state manager instance"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/functions/createBaseState.md",children:"createBaseState"})," - Creates the core state data structure"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/functions/deepCopy.md",children:"deepCopy"})," - Creates deep copy of state"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/functions/shallowCopy.md",children:"shallowCopy"})," - Creates shallow copy"]}),`
`]}),`
`,e.jsxs(t.h4,{id:"state-operations",children:["State Operations",e.jsx(t.a,{"aria-hidden":"true",tabIndex:"-1",href:"#state-operations",children:e.jsx(t.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/functions/getAccount.md",children:"getAccount"})," - Retrieves account state"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/functions/putAccount.md",children:"putAccount"})," - Updates account state"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/functions/deleteAccount.md",children:"deleteAccount"})," - Removes an account"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/functions/getContractCode.md",children:"getContractCode"})," - Gets contract bytecode"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/functions/putContractCode.md",children:"putContractCode"})," - Updates contract bytecode"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/functions/getContractStorage.md",children:"getContractStorage"})," - Gets contract storage"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/functions/putContractStorage.md",children:"putContractStorage"})," - Updates contract storage"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/functions/clearContractStorage.md",children:"clearContractStorage"})," - Clears contract storage"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/functions/getAccountAddresses.md",children:"getAccountAddresses"})," - Gets account addresses"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/functions/getAppliedKey.md",children:"getAppliedKey"})," - Gets applied storage key"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/functions/modifyAccountFields.md",children:"modifyAccountFields"})," - Modifies account fields"]}),`
`]}),`
`,e.jsxs(t.h4,{id:"state-root-management",children:["State Root Management",e.jsx(t.a,{"aria-hidden":"true",tabIndex:"-1",href:"#state-root-management",children:e.jsx(t.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/functions/getStateRoot.md",children:"getStateRoot"})," - Gets current state root"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/functions/setStateRoot.md",children:"setStateRoot"})," - Sets new state root"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/functions/hasStateRoot.md",children:"hasStateRoot"})," - Checks if state root exists"]}),`
`]}),`
`,e.jsxs(t.h4,{id:"checkpointing-and-committing",children:["Checkpointing and Committing",e.jsx(t.a,{"aria-hidden":"true",tabIndex:"-1",href:"#checkpointing-and-committing",children:e.jsx(t.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/functions/checkpoint.md",children:"checkpoint"})," - Creates a state checkpoint"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/functions/commit.md",children:"commit"})," - Commits state changes"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/functions/revert.md",children:"revert"})," - Reverts to previous checkpoint"]}),`
`]}),`
`,e.jsxs(t.h4,{id:"cache-management",children:["Cache Management",e.jsx(t.a,{"aria-hidden":"true",tabIndex:"-1",href:"#cache-management",children:e.jsx(t.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/functions/clearCaches.md",children:"clearCaches"})," - Clears all state caches"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/functions/originalStorageCache.md",children:"originalStorageCache"})," - Manages original storage cache"]}),`
`]}),`
`,e.jsxs(t.h4,{id:"genesis-and-forking",children:["Genesis and Forking",e.jsx(t.a,{"aria-hidden":"true",tabIndex:"-1",href:"#genesis-and-forking",children:e.jsx(t.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/functions/dumpCanonicalGenesis.md",children:"dumpCanonicalGenesis"})," - Dumps canonical genesis state"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/functions/generateCanonicalGenesis.md",children:"generateCanonicalGenesis"})," - Generates canonical genesis"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/functions/getForkBlockTag.md",children:"getForkBlockTag"})," - Gets fork block tag"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/functions/getForkClient.md",children:"getForkClient"})," - Gets fork client"]}),`
`]}),`
`,e.jsxs(t.h4,{id:"storage-operations",children:["Storage Operations",e.jsx(t.a,{"aria-hidden":"true",tabIndex:"-1",href:"#storage-operations",children:e.jsx(t.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/functions/dumpStorage.md",children:"dumpStorage"})," - Dumps storage state"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/functions/dumpStorageRange.md",children:"dumpStorageRange"})," - Dumps storage range"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/packages/state/docs/functions/getProof.md",children:"getProof"})," - Gets state proof"]}),`
`]}),`
`,e.jsxs(t.h2,{id:"usage-examples",children:["Usage Examples",e.jsx(t.a,{"aria-hidden":"true",tabIndex:"-1",href:"#usage-examples",children:e.jsx(t.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(t.h3,{id:"creating-a-state-manager",children:["Creating a State Manager",e.jsx(t.a,{"aria-hidden":"true",tabIndex:"-1",href:"#creating-a-state-manager",children:e.jsx(t.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(e.Fragment,{children:e.jsx(t.pre,{className:"shiki shiki-themes github-light github-dark-dimmed",style:{backgroundColor:"#fff","--shiki-dark-bg":"#22272e",color:"#24292e","--shiki-dark":"#adbac7"},tabIndex:"0",children:e.jsx(t.code,{children:e.jsx(t.span,{className:"line","data-empty-line":!0,children:" "})})})})]})}function o(a={}){const{wrapper:t}={...n(),...a.components};return t?e.jsx(t,{...a,children:e.jsx(s,{...a})}):s(a)}export{o as default,r as frontmatter};
