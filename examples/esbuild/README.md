<p align="center">
  <a href="https://evmts.dev/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/35039927/218812217-92f0f784-cb85-43b9-9ca6-e2b9effd9eb2.png">
      <img alt="wagmi logo" src="https://user-images.githubusercontent.com/35039927/218812217-92f0f784-cb85-43b9-9ca6-e2b9effd9eb2.png" width="auto" height="300">
    </picture>
  </a>
</p>

<p align="center">
  Evmts esbuild viem Boilerplate
<p>

To use this plugin with Visual Studio Code, you should set your workspace's version of TypeScript, which will load plugins from your tsconfig.json file.

For instructions, see: [Using the workspace version of TypeScript](https://code.visualstudio.com/docs/typescript/typescript-compiling#_using-the-workspace-version-of-typescript).

## ✨ What is this?

This is a [Evmts](https://evmts.dev) + [viem](https://viem.sh) ! [esbuild](https://esbuild.github.io/api/) boilerplate to get started using Evmts quickly

Evmts allows you to import Solidity directly into your NEXT.js typescript files with great editor support and minimal boilerplate.  Features include

- Etherscan links on hover
- Human readable ABIs
- Seemless integration with wagmi for reads, writes, and events
- No ABIs referenced again just import the contract directly
- No Addresses needed to be copy pasted just configure them in the [tsconfig](./tsconfig.json)

## 🌟 Evmts features

- Direct contract imports with etherscan links on hover

<img width="831" alt="image" src="https://github.com/evmts/evmts-next-example/assets/35039927/b824bc01-bf47-46fa-8b2b-bd0fea5f988f">

- [Read example](./src/wagmi/WagmiReads.tsx)

<img width="988" alt="image" src="https://github.com/evmts/evmts-next-example/assets/35039927/315711e7-1697-40bb-84c5-59e30b0ccb7a">

- [Write example](./src/wagmi/WagmiWrites.tsx)

<img width="1013" alt="image" src="https://github.com/evmts/evmts-next-example/assets/35039927/38975379-4eb1-47c2-8b15-560b676db029">

- [Events example](./src/wagmi/WagmiEvents.tsx)

<img width="1115" alt="image" src="https://github.com/evmts/evmts-next-example/assets/35039927/349b0a73-62e7-4517-a03c-8951a471c8be">

# 📜 Docs

Evmts docs exist at [evmts.dev](https://evmts.dev). As Evmts is currently still in Alpha and following [documentation driven development](https://gist.github.com/zsup/9434452) much of the documented behavior may not be implemented yet.

# 🤝 Getting Started

Run `npm run dev` in your terminal. If you are not using node18 you may have to pass in `--experimental-fetch` to node. Use [NVM](https://github.com/nvm-sh/nvm) with `nvm use` command to use this workspaces node version

# 🔧 Configuration

This boilerplate comes preconfigured but we will document what needed to be configured in case you are following along to add to your own NEXT.js app

Evmts requires two pieces of configuration to get started.

1. TypeScript configuration

`@evmts/ts-plugin` is configured in the [tsconfig.json](./tsconfig.json). Evmts uses this configuration to configure the addresses, solc version etc.  The TypeScript plugin provides TypeScript editor support for your Solidity imports.

2. Bundler configuration

The bundler is how the files are processed at runtime. This boilerplate uses esbuild. Simple esbuild configuration is done in the [build.ts](./build.ts) file. The plugin here will read the configuration in the [tsconfig.json](./tsconfig.json)

## 🪄 Usage examples

Usage examples are in [src](./src/) folder

## 💻 VSCode setup

- **Recommended usage**

To use this plugin with Visual Studio Code, you should set your workspace's version of TypeScript, which will load plugins from your tsconfig.json file.

For instructions, see: [Using the workspace version of TypeScript](https://code.visualstudio.com/docs/typescript/typescript-compiling#_using-the-workspace-version-of-typescript).

- **Alternative usage**
You can simple add this plugin to "typescript.tsserver.pluginPaths" in settings. You cannot provide plugin options such as contract addresseswith this approach.

{
  "typescript.tsserver.pluginPaths": ["@evmts/ts-plugin"]
}

- **Other editors**

Other editors are not tested/documented yet. I personally use neovim successfully and it should work in most editors. They all work via the ts-plugin settings similar to vscode.

## 🩹 Rough edges

#### Typechecking

Typechecking is disabled in the next.config.ts. Your editor will typecheck and provide diagnostics correctly but the NEXT.js build is not configured yet.

Full TypeChecking will be available soon in one of the next few releases of Evmts alpha after it migrates the langauge server to [volar](https://volarjs.github.io/)

## ⭐ Github

If you like Evmts give it a ⭐ at the [Evmts monorepo](https://github.com/evmts/evmts-monorepo)

## 🔗 See also

- Check out [Next example](https://github.com/orgs/evmts/repositories) for an example of Evmts wagmi and Next
- Check out [Vite example](https://github.com/evmts/evmts-monorepo/tree/main/examples/vite) for an example of Evmts wagmi and Vite

