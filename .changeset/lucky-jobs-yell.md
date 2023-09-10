---
"@evmts/ts-plugin": patch
---

Updated @evmts/ts-plugin to use LSP to get files

Previously EVMts relied on `fs.readFileSync` to implement the LSP. By replacing this with using `typescriptLanguageServer.readFile` we are able to rely on the LSP to get the file instead of the file system

In future versions of EVMts when we add a vscode plugin this will make the LSP smart enough to update before the user even clicks `save`

