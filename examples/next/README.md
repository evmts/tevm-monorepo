This is a [Evmts](https://evmts.dev) [wagmi](https://wagmi.sh) + [RainbowKit](https://rainbowkit.com) + [Next.js](https://nextjs.org)

Evmts allows you to import Solidity directly into your NEXT.js typescript files with great editor support and minimal boilerplate.  Features include

- Etherscan links on hover
- Human readable ABIs
- Seemless integration with wagmi for reads, writes, and events
- No ABIs referenced again just import the contract directly
- No Addresses needed to be copy pasted just configure them in the [tsconfig](./tsconfig.json)

App

- Direct contract imports with etherscan links on hover

<img width="831" alt="image" src="https://github.com/evmts/evmts-next-example/assets/35039927/b824bc01-bf47-46fa-8b2b-bd0fea5f988f">

- [Read example](./src/wagmi/WagmiReads.tsx)

<img width="988" alt="image" src="https://github.com/evmts/evmts-next-example/assets/35039927/315711e7-1697-40bb-84c5-59e30b0ccb7a">

- [Write example](./src/wagmi/WagmiWrites.tsx)

<img width="1013" alt="image" src="https://github.com/evmts/evmts-next-example/assets/35039927/38975379-4eb1-47c2-8b15-560b676db029">

- [Events example](./src/wagmi/WagmiEvents.tsx)

<img width="1115" alt="image" src="https://github.com/evmts/evmts-next-example/assets/35039927/349b0a73-62e7-4517-a03c-8951a471c8be">

# Docs

Evmts docs exist at [evmts.dev](https://evmts.dev). Until Evmts is in Beta many of the documented behavior may not be implemented yet.

# Getting Started

Run `npm run dev` in your terminal, and then open [localhost:3000](http://localhost:3000) in your browser.

Once the webpage has loaded, changes made to files inside the `src/` directory (e.g. `src/pages/index.tsx`) will automatically update the webpage.

# Configuration

Evmts requires two pieces of configuration to get started.

1. TypeScript configuration

`@evmts/ts-plugin` is configured in the [tsconfig.json](./tsconfig.json). Evmts uses this configuration to configure the addresses, solc version etc.

2. Bundler configuration

Next.js uses webpack. Simple webpack configuration is done in the [next.config.js](./next.config.js). The plugin here will read the configuration in the [tsconfig.json](./tsconfig.json)

# Usage examples

Usage examples with wagmi are in [src/wagmi/](./src/wagmi/) folder

# VSCode setup

- **Recommended usage**

To use this plugin with Visual Studio Code, you should set your workspace's version of TypeScript, which will load plugins from your tsconfig.json file.

For instructions, see: [Using the workspace version of TypeScript](https://code.visualstudio.com/docs/typescript/typescript-compiling#_using-the-workspace-version-of-typescript).

- **Alternative usage**
You can simple add this plugin to "typescript.tsserver.pluginPaths" in settings. You cannot provide plugin options such as contract addresseswith this approach.

{
  "typescript.tsserver.pluginPaths": ["@evmts/ts-plugin"]
}

- **Other editors**

Other editors are not tested/documented yet (I personally use neovim though successfully). They all work via the ts-plugin settings similar to vscode.

# Rough edges

## Typechecking

Typechecking is disabled in the next.config.ts. Your editor will typecheck successfully.

TypeChecking will be available soon in one of the next few releases of Evmts alpha

As a workaround .ts files can be generated to enable typechecking with `tsc`. To run the code gen tool run `evmts-gen` cli tool Codegen is undocumented and may lose support on future versions of Evmts so it is recomended to wait for the official typechecking tool

