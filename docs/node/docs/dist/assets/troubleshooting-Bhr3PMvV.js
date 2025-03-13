import{u as r,j as e}from"./index-AxmTGXNp.js";const o={title:"Bundler Troubleshooting",description:"Solutions for common Tevm bundler issues"};function i(n){const s={a:"a",code:"code",div:"div",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",span:"span",strong:"strong",ul:"ul",...r(),...n.components};return e.jsxs(e.Fragment,{children:[e.jsx(s.header,{children:e.jsxs(s.h1,{id:"bundler-troubleshooting",children:["Bundler Troubleshooting",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#bundler-troubleshooting",children:e.jsx(s.div,{"data-autolink-icon":!0})})]})}),`
`,e.jsx(s.p,{children:"This guide addresses common issues that may arise when using the Tevm bundler."}),`
`,e.jsxs(s.h2,{id:"common-issues",children:["Common Issues",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#common-issues",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.h3,{id:"1-missing-or-red-underlines-in-editor",children:["1. Missing or Red Underlines in Editor",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#1-missing-or-red-underlines-in-editor",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Symptoms"}),": Your editor shows red underlines for Solidity imports, or auto-completion doesn't work."]}),`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Solution"}),":"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["Confirm you have ",e.jsx(s.code,{children:'"plugins": [{ "name": "@tevm/ts-plugin" }]'})," in tsconfig.json"]}),`
`,e.jsxs(s.li,{children:['In VS Code or Cursor, switch to the "workspace version" of TypeScript:',`
`,e.jsxs(s.ol,{children:[`
`,e.jsx(s.li,{children:"Open Command Palette (Ctrl+Shift+P or Cmd+Shift+P)"}),`
`,e.jsx(s.li,{children:'Type "TypeScript: Select TypeScript Version"'}),`
`,e.jsx(s.li,{children:'Select "Use Workspace Version"'}),`
`]}),`
`]}),`
`,e.jsx(s.li,{children:"For Vim, Neovim, and other editors, ensure they're using the workspace TypeScript version"}),`
`]}),`
`,e.jsxs(s.h3,{id:"2-type-check-errors-with-nextjs",children:["2. Type-check Errors with Next.js",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#2-type-check-errors-with-nextjs",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Symptoms"}),": Your build works, but Next.js type-checking fails with errors about ",e.jsx(s.code,{children:".sol"})," imports."]}),`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Solution"}),":"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["Next's built-in type checker might not handle dynamic ",e.jsx(s.code,{children:".sol"})," imports well"]}),`
`,e.jsxs(s.li,{children:["Option 1: Disable type-checking in next.config.mjs:",`
`,e.jsx(e.Fragment,{children:e.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark",style:{backgroundColor:"#fff","--shiki-dark-bg":"#24292e",color:"#24292e","--shiki-dark":"#e1e4e8"},tabIndex:"0",children:e.jsxs(s.code,{children:[e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#6A737D"},children:"// next.config.mjs"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F97583"},children:"export"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F97583"},children:" default"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:" {"})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:"  typescript: {"})}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#6A737D"},children:"    // Typechecking will only be available after the LSP is migrated to volar"})}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#6A737D"},children:"    // Until then typechecking will work in editor but not during a next.js build "})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:"    ignoreBuildErrors: "}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#79B8FF"},children:"true"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:","})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:"  }"})}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:"}"})})]})})}),`
`]}),`
`,e.jsxs(s.li,{children:["Option 2: Use the ",e.jsx(s.a,{href:"#codegen-approach",children:"Codegen Approach"})," (recommended for Next.js)"]}),`
`]}),`
`,e.jsxs(s.h3,{id:"3-file-not-found-errors",children:['3. "File Not Found" Errors',e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#3-file-not-found-errors",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Symptoms"}),": Bundler can't find imported Solidity files, especially with custom paths."]}),`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Solution"}),":"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"Check that your libraries or local imports are accounted for in libs or remappings"}),`
`,e.jsxs(s.li,{children:["If you're using Foundry, ensure ",e.jsx(s.code,{children:"foundryProject: true"})," is set in tevm.config.json"]}),`
`,e.jsx(s.li,{children:"For npm packages, verify they're installed and the import path is correct"}),`
`,e.jsxs(s.li,{children:["For complex import structures, add explicit remappings:",`
`,e.jsx(e.Fragment,{children:e.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark",style:{backgroundColor:"#fff","--shiki-dark-bg":"#24292e",color:"#24292e","--shiki-dark":"#e1e4e8"},tabIndex:"0",children:e.jsxs(s.code,{children:[e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#6A737D"},children:"// tevm.config.json"})}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:"{"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#79B8FF"},children:'  "remappings"'}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:": {"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#79B8FF"},children:'    "@customlib/"'}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:": "}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#9ECBFF"},children:'"node_modules/@customlib/"'}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:","})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#79B8FF"},children:'    "local/"'}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:": "}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#9ECBFF"},children:'"./contracts/"'})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:"  }"})}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:"}"})})]})})}),`
`]}),`
`]}),`
`,e.jsxs(s.h3,{id:"4-cache-stale-issues",children:["4. Cache Stale Issues",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#4-cache-stale-issues",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Symptoms"}),": Changes to Solidity files don't appear to take effect."]}),`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Solution"}),":"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["If a contract's changes don't appear to be recognized, remove the ",e.jsx(s.code,{children:".tevm"})," folder and rebuild"]}),`
`,e.jsxs(s.li,{children:["The ",e.jsx(s.code,{children:".tevm"})," directory is ephemeral - you can safely delete it at any time"]}),`
`,e.jsxs(s.li,{children:["Add ",e.jsx(s.code,{children:".tevm"})," to your ",e.jsx(s.code,{children:".gitignore"})," to prevent caching issues in version control"]}),`
`]}),`
`,e.jsxs(s.h3,{id:"5-no-bytecode-available",children:["5. No Bytecode Available",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#5-no-bytecode-available",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Symptoms"}),": Contract deployment fails with errors about missing bytecode."]}),`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Solution"}),":"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["Check that you're using the ",e.jsx(s.code,{children:".s.sol"})," extension for contracts you want to deploy"]}),`
`,e.jsxs(s.li,{children:["Regular ",e.jsx(s.code,{children:".sol"})," files only generate ABIs, not deployable bytecode"]}),`
`,e.jsxs(s.li,{children:["Rename your file from ",e.jsx(s.code,{children:"Contract.sol"})," to ",e.jsx(s.code,{children:"Contract.s.sol"})," if you need bytecode"]}),`
`]}),`
`,e.jsxs(s.h3,{id:"6-deployment-errors",children:["6. Deployment Errors",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#6-deployment-errors",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Symptoms"}),": Contract deployment fails even with bytecode available."]}),`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Solution"}),":"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["Make sure you're calling ",e.jsx(s.code,{children:".deploy()"})," with any required constructor arguments:",`
`,e.jsx(e.Fragment,{children:e.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark",style:{backgroundColor:"#fff","--shiki-dark-bg":"#24292e",color:"#24292e","--shiki-dark":"#e1e4e8"},tabIndex:"0",children:e.jsxs(s.code,{children:[e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#6A737D"},children:"// Incorrect (when contract has constructor args)"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F97583"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#79B8FF"},children:" deployed"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F97583"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F97583"},children:" await"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:" client."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#B392F0"},children:"deployContract"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:"(MyToken)"})]}),`
`,e.jsx(s.span,{className:"line","data-empty-line":!0,children:" "}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#6A737D"},children:"// Correct"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F97583"},children:"const"}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#79B8FF"},children:" deployed"}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F97583"},children:" ="}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F97583"},children:" await"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:" client."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#B392F0"},children:"deployContract"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:"("})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:"  MyToken."}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#B392F0"},children:"deploy"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:"("}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#9ECBFF"},children:'"TokenName"'}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:", "}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#9ECBFF"},children:'"TKN"'}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:", "}),e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#79B8FF"},children:"18"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:")"})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:")"})})]})})}),`
`]}),`
`]}),`
`,e.jsxs(s.h3,{id:"7-test-runner-issues",children:["7. Test Runner Issues",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#7-test-runner-issues",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Symptoms"}),": Tests using ",e.jsx(s.code,{children:".sol"})," imports fail in Jest or other test runners."]}),`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Solution"}),":"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"Most test runners (Vitest) work out-of-the-box once the bundler plugin is configured"}),`
`,e.jsx(s.li,{children:"For Jest, you might need extra configuration or use the codegen approach"}),`
`,e.jsx(s.li,{children:"Consider using the bundler that matches your test environment (esbuild for Vitest, etc.)"}),`
`]}),`
`,e.jsxs(s.h2,{id:"codegen-approach",children:["Codegen Approach",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#codegen-approach",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(s.p,{children:"If you're encountering persistent bundler-related issues, particularly with frameworks like Next.js, or if you prefer to have explicit TypeScript files for your contracts, the codegen approach may be better suited for your needs."}),`
`,e.jsxs(s.h3,{id:"what-is-codegen",children:["What is Codegen?",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#what-is-codegen",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.p,{children:["The codegen approach generates ",e.jsx(s.code,{children:".ts"})," files from your ",e.jsx(s.code,{children:".sol"})," files ahead of time, rather than during the build process. This results in regular TypeScript files that can be imported normally."]}),`
`,e.jsxs(s.h3,{id:"using-codegen",children:["Using Codegen",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#using-codegen",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(s.p,{children:"To generate TypeScript files for your Solidity contracts:"}),`
`,e.jsx(e.Fragment,{children:e.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark",style:{backgroundColor:"#fff","--shiki-dark-bg":"#24292e",color:"#24292e","--shiki-dark":"#e1e4e8"},tabIndex:"0",children:e.jsx(s.code,{children:e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#B392F0"},children:"npx"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#9ECBFF"},children:" tevm"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#9ECBFF"},children:" gen"})]})})})}),`
`,e.jsx(s.p,{children:"This will:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["Generate ",e.jsx(s.code,{children:".ts"})," files next to each ",e.jsx(s.code,{children:".sol"})," file (or wherever configured)"]}),`
`,e.jsx(s.li,{children:"Create TypeScript files that you can commit to source control"}),`
`,e.jsx(s.li,{children:"Produce the same output as the bundler, but in a pre-build step"}),`
`]}),`
`,e.jsxs(s.p,{children:["These generated ",e.jsx(s.code,{children:".ts"})," files can be imported directly in your code:"]}),`
`,e.jsx(e.Fragment,{children:e.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark",style:{backgroundColor:"#fff","--shiki-dark-bg":"#24292e",color:"#24292e","--shiki-dark":"#e1e4e8"},tabIndex:"0",children:e.jsxs(s.code,{children:[e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#6A737D"},children:"// Import the generated TypeScript file"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F97583"},children:"import"}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:" { MyContract } "}),e.jsx(s.span,{style:{color:"#D73A49","--shiki-dark":"#F97583"},children:"from"}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#9ECBFF"},children:" './contracts/MyContract.js'"})]})]})})}),`
`,e.jsxs(s.h3,{id:"when-to-use-codegen",children:["When to Use Codegen",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#when-to-use-codegen",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(s.p,{children:"Codegen is especially helpful when:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"You have a framework that tightly controls its build pipeline (e.g., Next.js with enforced type-checking)"}),`
`,e.jsx(s.li,{children:"You prefer explicit, committed TypeScript artifacts for contracts"}),`
`,e.jsx(s.li,{children:"You want a stable CI pipeline or want to avoid runtime resolution"}),`
`,e.jsx(s.li,{children:"You're using Jest or another test runner that has difficulty with dynamic imports"}),`
`]}),`
`,e.jsxs(s.h3,{id:"codegen-configuration",children:["Codegen Configuration",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#codegen-configuration",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.p,{children:["You can configure the codegen tool by adding options to your ",e.jsx(s.code,{children:"tevm.config.json"}),":"]}),`
`,e.jsx(e.Fragment,{children:e.jsx(s.pre,{className:"shiki shiki-themes github-light github-dark",style:{backgroundColor:"#fff","--shiki-dark-bg":"#24292e",color:"#24292e","--shiki-dark":"#e1e4e8"},tabIndex:"0",children:e.jsxs(s.code,{children:[e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:"{"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#79B8FF"},children:'  "gen"'}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:": {"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#79B8FF"},children:'    "outDir"'}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:": "}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#9ECBFF"},children:'"./generated"'}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:",  "}),e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#6A737D"},children:"// Where to generate files"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#79B8FF"},children:'    "patterns"'}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:": ["}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#9ECBFF"},children:'"contracts/**/*.sol"'}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:"],  "}),e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#6A737D"},children:"// Which files to process"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#005CC5","--shiki-dark":"#79B8FF"},children:'    "exclude"'}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:": ["}),e.jsx(s.span,{style:{color:"#032F62","--shiki-dark":"#9ECBFF"},children:'"**/node_modules/**"'}),e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:"]    "}),e.jsx(s.span,{style:{color:"#6A737D","--shiki-dark":"#6A737D"},children:"// Which files to ignore"})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:"  }"})}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292E","--shiki-dark":"#E1E4E8"},children:"}"})})]})})}),`
`,e.jsxs(s.h2,{id:"additional-resources",children:["Additional Resources",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#additional-resources",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsx(s.p,{children:"If you're still experiencing issues:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["Check the ",e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/issues",children:"GitHub Issues"})," for similar problems and solutions"]}),`
`,e.jsxs(s.li,{children:["Look at the ",e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/examples",children:"Examples"})," for working configurations"]}),`
`,e.jsxs(s.li,{children:["Join the Tevm community on ",e.jsx(s.a,{href:"https://discord.gg/tevm",children:"Discord"})," for direct assistance"]}),`
`,e.jsxs(s.li,{children:["For Next.js specific issues, see the ",e.jsx(s.a,{href:"https://github.com/evmts/tevm-monorepo/tree/main/examples/next",children:"Next.js example"})," in the Tevm repository"]}),`
`]}),`
`,e.jsxs(s.h2,{id:"further-reading",children:["Further Reading",e.jsx(s.a,{"aria-hidden":"true",tabIndex:"-1",href:"#further-reading",children:e.jsx(s.div,{"data-autolink-icon":!0})})]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/reference/bundler/overview",children:"Bundler Overview"})," - Key benefits and features"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/reference/bundler/internals",children:"Bundler Internals"})," - How the bundler works"]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.a,{href:"/reference/bundler/methods",children:"Methods & Exports"})," - Advanced APIs and utilities"]}),`
`]})]})}function d(n={}){const{wrapper:s}={...r(),...n.components};return s?e.jsx(s,{...n,children:e.jsx(i,{...n})}):i(n)}export{d as default,o as frontmatter};
