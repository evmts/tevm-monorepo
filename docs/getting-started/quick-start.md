# Quick Start

::: tip
New to Evmts?

- [Read the introduction](../getting-started/introduction.md)
- [Try out our beginners tutorial](../tutorial/overview.md)
- [Try the live online demo](https://stackblitz.com/github/evmts/evmts-monorepo?configPath=examples/vite)
:::

## Starting a new project with Evmts

Fork one of the example projects

- [Wagmi and NEXT.js](https://github.com/evmts/evmts-next-example) - good for server rendered React projects
- [Viem and Esbuild](https://github.com/evmts/evmts-esbuild-viem-example) - Good for simple typescript libraries and code
- [Wagmi and Vite](https://github.com/evmts/evmts-monorepo/tree/main/examples/vite) - Good for clientside React applications
- [COMING SOON] Ethers.js+tsup NPM library example

## Adding Evmts to an existing project

To add a Evmts to an existing tool you must configure 2 things

1. Your Typescript language server

The language server will give you support in your editor for things like autoimport, autocomplete, information on hover, and TypeSafety.

🏗️🚧 Note: autoimport, and compiletime typechecking are not yet implemented. Go-to-definition support is currently minimal.

**important** - If your application or library generates .d.ts files or runs `tsc --emit` you will need to see our [typescript docs](../tutorial/typescript) for additional instruction.

Install Evmts core
```bash
npm install @evmts/core
```

Install the typescript plugin and the solc compiler as dev dependencies

```bash
npm install --save-dev @evmts/ts-plugin solc@0.8.20
```
And then configure it in your ts-config (note the cli on previous step may have already done this step)

🏗️🚧 Note: you must currently also copy your evmts.config.ts config such as `deployments` key into tsconfig.json. In later alpha release this will no longer be necessary

```json
{
  compilerOptions: {
    plugins: ["@evmts/plugin"]
  }
}
```

Additional steps may be needed to configure your specific editors language server. If you use vscode see [vscode guide](../guides/vscode)

The default should work out the box but it is recomended to copy a config from an example project for more advanced configuration.

2. Your bundler

Contract imports require a bundler such as esbuild, webpack, vite, rspack, or rollup. Many projects already have a bundler.

If you are unsure which bundler to use [esbuild](../guides/esbuild.md) is a good place to start as it's the most analogous to just using `ts-node` or `tsc`.

Find [your specific bundlers guide](../guides/overview.md) for instructions on how to configure it. Bundlers don't require configuration as the `evmts.config.ts` file will be used for configuration

🏗️🚧 Note: Only vite has been tested as of this alpha release. Other bundlers should work as well but report problems if they arise

## Additional info

[File an issue](https://github.com/evmts/evmts-monorepo/issues) if you run into problems

- **See also**

[Evmts tutorial](../tutorial/overview.md)

