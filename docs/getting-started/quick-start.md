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

## Adding Evmts to an existing project

To add a Evmts to an existing tool you must configure 2 things

1. A JavaScript bundler such as Vite, Rollup, or Webpack to bundle your contract code into the application
2. Your LSP so you get features such as autocomplete, typesafety, and autoimports in your editor

#### Bundler configuration

Contract imports require a bundler such as esbuild, webpack, vite, rspack, or rollup. Many projects already have a bundler.

If you are unsure which bundler to use [esbuild](../guides/esbuild.md) is a good place to start

Find [your specific bundlers guide](../guides/overview.md) for instructions on how to configure it. Bundlers don't require configuration as the `evmts.config.ts` file will be used for configuration

#### LSP Configuration

The language server will give you support in your editor for things like autoimport, autocomplete, information on hover, and TypeSafety. Some features may not be implemented pre Beta release

**important** - Typechecking via running TSC is not yet enabled. As of now the LSP only runs in your code editor. Check in for updates as full LSP support including a proper typechecker will be enabled soon

Install Evmts core

```bash
npm install @evmts/core
```

Install the typescript plugin and the solc compiler as dev dependencies

```bash
npm install --save-dev @evmts/ts-plugin solc@0.8.20
```
And then configure it in your ts-config

```json
{
  compilerOptions: {
    plugins: ["@evmts/plugin"]
  }
}
```

Additional steps may be needed to configure your specific editors language server. If you use vscode see [vscode guide](../guides/vscode)

The default should work out the box but it is recomended to copy a config from an example project for more advanced configuration.

## Additional info

[File an issue](https://github.com/evmts/evmts-monorepo/issues) if you run into problems

- **See also**

[Evmts tutorial](../tutorial/overview.md)

