---
"@evmts/bundler": patch
---

Updated @evmts/bundler to take a fileAccessObject as a parameter

### Context
@evmts/bundler is the internal bundler for all other bundlers and the language server. We changed it to take fileAccessObject as a parameter instead of using `fs` and `fs/promises`

### Impact
By taking in a file-access-object instead of using `fs` we can implement important features. 

- the ability to use virtual files in the typescript lsp before the user saves the file. 
- the ability to use more peformant bun file read methods

