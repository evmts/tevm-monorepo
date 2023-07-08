# VSCode setup

- **Recommended usage**

To use this plugin with Visual Studio Code, you should set your workspace's version of TypeScript, which will load plugins from your tsconfig.json file.

For instructions, see: [Using the workspace version of TypeScript](https://code.visualstudio.com/docs/typescript/typescript-compiling#_using-the-workspace-version-of-typescript).

- **Alternative usage**
You can simple add this plugin to "typescript.tsserver.pluginPaths" in settings. You cannot provide plugin options with this approach.

{
  "typescript.tsserver.pluginPaths": ["@evmts/ts-plugin"]
}

