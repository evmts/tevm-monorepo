<p align="center">
  <a href="https://evmts.dev/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/35039927/218812217-92f0f784-cb85-43b9-9ca6-e2b9effd9eb2.png">
      <img alt="wagmi logo" src="https://user-images.githubusercontent.com/35039927/218812217-92f0f784-cb85-43b9-9ca6-e2b9effd9eb2.png" width="auto" height="300">
    </picture>
  </a>
</p>

<p align="center">
  Execute solidity scripts in browser 🏗️🚧
<p>

[![CI](https://github.com/evmts/evmts-monorepo/actions/workflows/e2e.yml/badge.svg)](https://github.com/evmts/evmts-monorepo/actions/workflows/e2e.yml)
[![CI](https://github.com/evmts/evmts-monorepo/actions/workflows/unit.yml/badge.svg)](https://github.com/evmts/evmts-monorepo/actions/workflows/unit.yml)
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

_🏗️🚧 EVMts is a work in progress_

EVMts core enables direct evm execution clientside with forge cheat codes 

EVMts imports enable a streamlined dev experience with direct solidity imports and integration with Wagmi

## Visit [Docs](https://evmts.dev/) for docs, guides, API and more! 📄

## See [EVMts Beta project board](https://github.com/orgs/evmts/projects/1) for progress on the upcoming beta release! 💥

## Runtime libraries 📦

- [core/](/core) - core evmts library
- [config/](/config) - Tooling for configuring an `evmts.config.ts` file

## Bundlers

Bundlers such as Rollup, Webpack, or Vite are used By JavaScript tools to control the import graph of JavaScript projects.   This is how `EVMts contract imports` are able to work seemlessly.

Bundlers are provided for all major tools.   If yours is not supported consider opening an issue.

All bundlers are in the [bundlers/\*](/bundlers) folder

- [@evmts/esbuild-plugin](/bundlers/esbuild-plugin) 
- [@evmts/rollup-plugin](/bundlers/rollup-plugin)
- [@evmts/rspack](/bundlers/rspack)
- [@evmts/vite-plugin](/bundlers/vite-plugin)
- [@evmts/webpack-plugin](/bundlers/webpack-plugin)

## Language server tools

The language service protocol is how tools such as VSCode and Neovim are able to provide features such as autocomplete, information on hover, autoimports, and more. EVMts language service tools brings this functionality to TypeScript for contracts.

Also included are tools for typechecking code and code generation for those using EVMts without a bundler

- [@evmts/ts-plugin](./lsp/ts-plugin/) - Typescript Server Plugin for decorating the TypeScript language server with additional functionality
- [@evmts/vscode](./lsp/ts-plugin/) - A work-in-progress vscode plugin for EVMts

## Apps 📦

- [@evmts/docs](/docs) Future documentation site.   Contains lots of unimplemented features such as a clientside VM
- [examples/*](/examples) Current [documentation site](https://evmts.dev) for EVMts Imports Beta

#### Example apps

- [examples/next](./examples/next/) An example of a forge/next app using evmts
- [examples/webpack](./examples/webpack) An example of a forge/webpack app using evmts
- [examples/vite](./examples/vite) An example of a forge/vite app using evmts
- [examples/rollup](./examples/rollup) An example of a forge/rollup library built with evmts
- [examples/esbuild](./examples/esbuild) An example of a forge/esbuild cli tool built with evmts

## Tests ✅

[e2e/](/e2e) Playwright e2e tests that run against the [example apps](./example)

## Getting started 🏗️

See [docs/evmts](/docs/introduction/get-started.md) for installation and and more detailed usage documentation.

See [docs/monorepo](/docs/monorepo.md) for documentation on how to execute the monorepo with nx

See [docs/contributing](/docs/contributing.md) for documentation on how to contribute to evmts. No contribution is too small

## Basic usage ✨

**Note: Scripting is currently unimplemented**

EVMts has future plans to enable solidity scripting and optimistic execution.   As of now only EVMts contract imports are supported

See [EVMts Beta project board](https://github.com/orgs/evmts/projects/1) for updates.

### 1. First write a script in solidity

Scripts in EVMts work exactly like the [scripts in forge](https://book.getfoundry.sh/tutorials/solidity-scripting)

```solidity [Example.s.sol]
pragma solidity ^0.8.17;

import {Script} from "forge-std/Script.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Example is Script {
    function run(ERC20 erc20Contract, address recipient, uint256 amount) external {
        address signer = vm.envAddress("SIGNER");
        vm.startBroadcast(signer);
        contract.transferFrom(signer, recipient, amount);
        vm.stopBroadcast();
    }
}
```

### 2. Then execute your script in TypeScript

- no code gen step
- no abis
- no boilerplate

Just import your script and run it.

```ts [example.ts]
import { Example } from "./Example.s.sol"; // [!code focus]
import { evmts } from "./evmts";
import { Address } from "@evmts/core";

const tokenAddress: Address = "0x4200000000000000000000000000000000000042";
const recipient: Address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
const amount = BigInt(420);

evmts // [!code focus]
  .script(Example) // [!code focus]
  .run(tokenAddress, receipeint, amount) // [!code focus]
  .broadcast()
  .then(({ txHash }) => {
    console.log(txHash);
  });
```

## Try EVMts now

You don't need to install anything just to play with EVMts! Try [editing this sandbox](https://github.com/evmts/evmts-monorepo/issues/10) or check out the [getting started docs](https://evmts.dev/introduction/installation.html)

## Author ✍️

- Will Cory ([@fucory](https://twitter.com/fucory))

## Security 🔒

If you believe you have found a security vulnerability we encourage you to responsibly disclose this and not open a public issue. We will investigate all legitimate reports. Email `will@oplabs.co` to disclose any security vulnerabilities.

## Contributing 💻

Please see our [contributing.md](/docs/contributing.md).

## 🚧 WARNING: UNDER CONSTRUCTION 🚧

**This project is work in progress and subject to frequent changes**

Looking to get started building a production-ready dapp? Check out [viem](https://viem.sh) <br />

Interested in the OP stack? Check out op stack blog here: https://optimism.mirror.xyz/fLk5UGjZDiXFuvQh6R_HscMQuuY9ABYNF7PI76-qJYs

## Check out these tools 🔧

Enjoy this tool? Check out these other awesome tools that make this library possible

- [Foundry](https://github.com/foundry-rs/foundry/tree/master/forge)
- [viem](https://viem.sh) 
- [abitype](https://abitype.dev/)
- [wagmi](https://wagmi.sh/react/comparison)

And these other awesome tools that helped with development process and planning

- [ethereumjs-monorepo](https://github.com/ethereumjs/ethereumjs-monorepo)
- [Verifiable rpc](https://github.com/liamzebedee/eth-verifiable-rpc)
- [Optimism (Dislcaimer I work here)](https://github.com/ethereum-optimism/optimism)
- [helios](https://github.com/a16z/helios)

## License 📄

<a href="./LICENSE"><img src="https://user-images.githubusercontent.com/35039927/231030761-66f5ce58-a4e9-4695-b1fe-255b1bceac92.png" width="200" /></a>
