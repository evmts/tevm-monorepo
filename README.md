<p align="center">
  <a href="https://evmts.dev/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/35039927/218812217-92f0f784-cb85-43b9-9ca6-e2b9effd9eb2.png">
      <img alt="wagmi logo" src="https://user-images.githubusercontent.com/35039927/218812217-92f0f784-cb85-43b9-9ca6-e2b9effd9eb2.png" width="auto" height="300">
    </picture>
  </a>
</p>

<p align="center">
  Evmts never juggle ABIs and contract addresses again (alpha 🏗️🚧)
<p>

[![CI](https://github.com/evmts/evmts-monorepo/actions/workflows/build.yml/badge.svg)](https://github.com/evmts/evmts-monorepo/actions/workflows/build.yml)
[![CI](https://github.com/evmts/evmts-monorepo/actions/workflows/test.yml/badge.svg)](https://github.com/evmts/evmts-monorepo/actions/workflows/test.yml)
<a href="https://www.npmjs.com/package/@evmts/core">
<img src="https://img.shields.io/npm/v/@evmts/core?style=flat" alt="Version">
</a>
<a href="https://www.npmjs.com/package/@evmts/core" target="\_parent">
<img alt="" src="https://img.shields.io/npm/dm/@evmts/core.svg" />
</a>
<a href="https://bundlephobia.com/package/@evmts/core@latest" target="\_parent">
<img alt="" src="https://badgen.net/bundlephobia/minzip/@evmts/core" />
</a><a href="#badge">

# evmts-monorepo

Evmts imports enable a streamlined dev experience with direct solidity imports and integration with Wagmi

An amazing LSP experience in your editor
- Etherscan links on hover
- Full typesafety within the LSP
- No code generation step for a TRPC-esque experience working on full-stack web3 apps

Support for all your favorite tools
- Wagmi/Viem+EVMts provides the premier dev experience for working with contracts in TypeScript
- Wagmi/Viem support is batteries included with no extra dependencies
- Superpowers Ethers.js typesafety and ergonomics with [@evmts/ethers](./docs/ethers/overview.md) library
- Support for Web3.js comming soon
- Support for all major bundlers and frameworks including [Next.js](./docs/guides/next.md), [Esbuild](./docs/guides/esbuild.md), [Vite](./docs/guides/vite.md) and more!
- Install contracts to use in your typescript code directly from etherscan

## Try it out

Try out our [online example on stackblitz](https://stackblitz.com/~/github.com/evmts/evmts-vite-wagmi-example)

## Get Started Quick

EVMts provides many starter projects and reference code to help get you started

- Our most popular project is the [NEXT.js and Wagmi starter project](https://github.com/evmts/evmts-next-example)
- Our official starter project for react projects is the [Vite and wagmi starter project](https://github.com/evmts/evmts-vite-wagmi-example)
- We don't only support react. Try out the [Svelte ethers starter project](https://github.com/evmts/evmts-svelte-ethers-example-)
- Building a backend application or npm library? Check out the [esbuild and viem starter project](https://github.com/evmts/evmts-esbuild-viem-example)
- WIP [scaffold eth 2 starter project](https://github.com/evmts/evmts-monorepo)

## Visit [Docs](https://evmts.dev/) for docs, guides, API and more! 📄

Note the docs are not guaranteed to be up to date until we reach beta status. This project follows documentation driven development so many documented features may be unimplemented.

## See [Evmts Beta project board](https://github.com/orgs/evmts/projects/1) for progress on the upcoming beta release! 💥

The beta release includes not only the build tools but also a local VM that can execute contract interactions blazingly fast.

## Basic usage ✨

### 1. Write a contract

Scripts in Evmts work exactly like the [scripts in forge](https://book.getfoundry.sh/tutorials/solidity-scripting)

```solidity [Example.s.sol]
pragma solidity ^0.8.17;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ExampleContract is ERC20 {
  ...
}
```

### 2. Deploy your contract with Foundry or Hardhat

### 3. Optional: Configure your contract address in your Evmts config

Configuring contract addresses for contracts you are developing in the Evmts config makes it so they automatically will have the correct address on whatever network you are using at the time without needing to import or specify them inline.

```typecript
{
  "localContracts":   {
    "contracts": {
      "name": "ExampleContract",
      "addresses": {
        "1": "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
        "10": "0x1df10ec981ac5871240be4a94f250dd238b77901",
      }
    }
  }
}

```

### 4. Optional: Install any external contracts

Using a third-party contract? Simply add it to your Evmts config and run `evmts generate` to install the contracts into your project. No more copy-pasting abis.

```typescript
{
  "externalContracts": {
    "out": "./src/contracts/external/",
    "apiKeys": {
      "etherscan": {
        "1": "$ETHERSCAN_API_KEY_1",
        "10": "$ETHERSCAN_API_KEY_10"
      }
    },
    "contracts": [
      {
        "type": "etherscan",
        "name": "DAI",
        "addresses": {
          "1": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
          "10": "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"
        }
      }
    ]
  },
}
```

```bash
evmts generate
```

### 5. Now use your contracts in your typescript

- no code gen step
- no boilerplate
- no abis

With Evmts you just import your contract directly and it **just works**

```ts [example.ts]
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

import { ExampleContract } from '../contracts/ExampleContract.sol'
import { rpcUrls } from './constants'

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(rpcUrls[mainnet.id]),
})

export const ownerOf = (tokenId = BigInt(1)) => {
  return publicClient.readContract(
    ExampleContract.read().ownerOf(tokenId),
  )
}

```

## Runtime libraries 📦

- [@evmts/core](/core) - Contains core runtime code for Evmts contracts with first class [Wagmi](https://wagmi.sh/) and [Viem](https://viem.sh) support
- [@evmts/ethers](/ethers) - Wrapper around ethers providing typesafe contracts directly with your EVMts contracts

## CLI tools

- [@evmts/cli](/cli) - A cli tool for installing contracts from block explorers

## Bundlers

Bundlers such as Rollup, Webpack, or Vite control the import graph of JavaScript projects. This is how graphql, CSS modules, and many other filetypes work seemlessly in the JavaScript ecosystem and this is how `Evmts contract imports` are also able to work seemlessly.

**With Evmts you don't need to configure ABIs and contract addresses in your application code. Just import the contract and use it**

Bundlers are provided for all major tools.   If yours is not supported consider opening an issue.

All bundlers are in the [bundlers/\*](/bundlers) folder

- [config/](/config) - Tooling for configuring an `evmts.config.ts` file
- [@evmts/esbuild-plugin](/bundlers/esbuild-plugin)
- [@evmts/rollup-plugin](/bundlers/rollup-plugin)
- [@evmts/rspack](/bundlers/rspack)
- [@evmts/vite-plugin](/bundlers/vite-plugin)
- [@evmts/webpack-plugin](/bundlers/webpack-plugin)

## Language server tools

The language service protocol is how tools such as VSCode and Neovim are able to provide features such as autocomplete, information on hover, autoimports, and more. Evmts language service tools brings this functionality to TypeScript for contracts.

Also included are tools for typechecking code and code generation for those using Evmts without a bundler

- [@evmts/ts-plugin](./lsp/ts-plugin/) - Typescript Server Plugin for decorating the TypeScript language server with additional functionality
- [@evmts/vscode](./lsp/ts-plugin/) - A work-in-progress vscode plugin for Evmts

The LSP has an ongoing migration to [volar](https://volarjs.github.io/) which will provide even more features.

## Apps 📦

- [@evmts/docs](/docs) - The official Evmts docs site
- [examples/*](/examples) - Example apps for Evmts

#### Example apps

All example apps are also available as forkable repos of their own within the Evmts github organization

- [examples/next](./examples/next/) - An example of a forge/next app using Evmts and Wagmi
- [examples/vite](./examples/vite) - An example of a forge/vite app using Evmts and Wagmi
- [examples/esbuild](./examples/esbuild) - A minimalistic example of a forge/esbuild node app using Evmts and Viem
- [examples/rollup](./examples/rollup) - An example of a forge/rollup library built with Evmts and ethers.js

## Tests ✅

[e2e/](/e2e) Playwright e2e tests that run against the [example apps](./example)

## Try Evmts now

Fork one of our example projects to give it a try!

## Author ✍️

- Will Cory ([@fucory](https://twitter.com/fucory))

## Security 🔒

If you believe you have found a security vulnerability we encourage you to responsibly disclose this and not open a public issue. We will investigate all legitimate reports. Email `will@oplabs.co` to disclose any security vulnerabilities.

## Contributing 💻

Contributions are encouraged, but please open an issue before doing any major changes to make sure your change will be accepted.

## 🚧 WARNING: UNDER CONSTRUCTION 🚧

**This project is in alpha and subject to frequent changes**

Reach out if you want to use EVMts in a serious project and I will help make sure your project is updated when any breaking changes happen

## Check out these tools 🔧

Enjoy this tool? Check out these other awesome tools that make this library possible

- [abitype](https://abitype.dev/)
- [ethers.js](https://github.com/ethers-io/ethers.js)
- [solc](https://github.com/ethereum/solc-js/blob/master/index.ts)
- [@openzeppelin/solidity-ast](https://github.com/OpenZeppelin/solidity-ast)
- [unplugin](https://github.com/unjs/unplugin)
- [viem](https://viem.sh)
- [wagmi](https://wagmi.sh/)

And these other awesome tools that helped with development process and future features

- [ethereumjs-monorepo](https://github.com/ethereumjs/ethereumjs-monorepo)
- [Foundry](https://github.com/foundry-rs/foundry/tree/master/forge)
- [helios](https://github.com/a16z/helios)
- [Optimism](https://github.com/ethereum-optimism/optimism)
- [revm](https://github.com/bluealloy/revm)
- [Verifiable rpc](https://github.com/liamzebedee/eth-verifiable-rpc)

## Future plans

This library has ambitious future plans to add features such as
- Ability to use forge scripts in your clientside or serverside JavaScript code
- A clientside VM
- Instant gas estimation calculated clientside
- Optimistic execution
- Trustless RPC layer
- And more!

Star and watch this repo for release updates

## License 📄

<a href="./LICENSE"><img src="https://user-images.githubusercontent.com/35039927/231030761-66f5ce58-a4e9-4695-b1fe-255b1bceac92.png" width="200" /></a>
