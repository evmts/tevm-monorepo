# language-tools-starter

This is a template for building Embedded Language Tools based on Volar Framework.

If you're working on something like this, you probably started with VSCode's [Embedded Programming Languages](https://code.visualstudio.com/api/language-extensions/embedded-languages) chapter. If not, I strongly suggest you read it carefully first.

The article mentions two methods to implement Embedded Language support. This template belongs to the extension of the "Language Server for Embedded Language with Language Services" method, but we abstract all the places you don't need to care about, such as virtual code mapping, formatting edits merge etc.

Same with the article, this template uses .html1 as an example to implement embedded HTML and CSS support.

## Tools

- pnpm: monorepo support
- esbuild: bundle extension

## Running the Sample

- Run `pnpm install` in this folder. This installs all necessary npm modules in both the client and server folder
- Open VS Code on this folder.
- Press Ctrl+Shift+B to compile the client and server.
- Switch to the Debug viewlet.
- Select `Launch Client` from the drop down.
- Run the launch config.
- If you want to debug the server as well use the launch configuration `Attach to Server`
- In the [Extension Development Host] instance of VSCode, open a `test.html1`
  - Type `<d|` to try HTML completion
  - Type `<style>.foo { c| }</style>` to try CSS completion
  - Have `<style>.foo { }</style>` to see CSS Diagnostics

## Build .vsix

- Run `pnpm run pack` in this folder
- `packages/vscode/vscode-html1-0.0.1.vsix` will be created, and you can manual install it to VSCode.

## References

- https://code.visualstudio.com/api/language-extensions/embedded-languages
- https://github.com/microsoft/vscode-extension-samples/tree/main/lsp-embedded-language-service
