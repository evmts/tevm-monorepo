<p align="center">
  <a href="https://evmts-monorepo-docs.vercel.app/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/35039927/218812217-92f0f784-cb85-43b9-9ca6-e2b9effd9eb2.png">
      <img alt="wagmi logo" src="https://user-images.githubusercontent.com/35039927/218812217-92f0f784-cb85-43b9-9ca6-e2b9effd9eb2.png" width="auto" height="300">
    </picture>
  </a>
</p>

<p align="center">
  Execute solidity scripts in browser
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

EVMts enables direct evm execution clientside with forge cheat codes and direct solidity file imports.

## Visit [Docs](https://evmts-monorepo-docs.vercel.app/) for docs, guides, API and more!

## See [EVMts Beta project board](https://github.com/orgs/evmts/projects/1) for progress on the upcoming beta release!

## Packages and apps

[packages](/packages)

- [@evmts/core](/packages/core) core evmts library
- [@evmts/plugin](/packages/plugin) rollup/vite plugin enabling solidity imports in Typescript files
- [@evmts/tsplugin](/packages/ts-plugin)

- [@evmts/playground](/playground) contains an example vite app for developing on evmts
- [@evmts/e2e](/e2e) contains e2e tests that run against all example apps
- [@evmts/docs](/docs) contains the docs astro app

## Getting started

See [docs/evmts](/docs/get-started.md) for installation and and more detailed usage documentation.

See [docs/monorepo](/docs/monorepo.md) for documentation on how to execute the monorepo with nx

See [docs/contributing](/docs/contributing.md) for documentation on how to contribute to evmts. No contribution is too small

## Basic usage

1. Write a [solidity script](/docs/guide/scripting.md). These work just like [forge scripts](https://book.getfoundry.sh/reference/forge/forge-script)

```solidity [TransferAllScript.s.sol]
pragma solidity ^0.8.17;

import {Script} from "forge-std/Script.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TransferAllScript is Script {
    function run(ERC20 contract, address recipient) external {
        address signer = vm.envUint("EVMTS_SIGNER")

        uint256 totalBalance = contract.balanceOf(signer)

        vm.startBroadcast(signer);
        contract.transferFrom(signer, recipient, totalBalance)
        vm.stopBroadcast();
    }
}
```

2. Now execute that script in your clientside typescript code

```ts [example.ts]
import { execute } from "@evmts/core";
import { TransferAllScript } from "./TransferAllScript.s.sol";
import { MyERC20 } from "./MyERC20.sol";
import { walletClient } from "./walletClient";
import { publicClient } from "./publicClient";

execute({
  script: TransferAllScript,
  args: [MyERC20, '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'];
  walletClient,
  publicClient,
}).broadcast().then(({txHash}) => console.log(txHash))
```

## Author

- Will Cory ([@fucory](https://twitter.com/fucory))

## Security

If you believe you have found a security vulnerability we encourage you to responsibly disclose this and not open a public issue. We will investigate all legitimate reports. Email `will@oplabs.co` to disclose any security vulnerabilities.

## Contributing

Please see our [contributing.md](/docs/contributing.md).

## 🚧 WARNING: UNDER CONSTRUCTION 🚧

**This project is work in progress and subject to frequent changes**

Looking to get started building a production-ready dapp? Check out [viem](https://viem.sh) <br />

Interested in the OP stack? Check out op stack blog here: https://optimism.mirror.xyz/fLk5UGjZDiXFuvQh6R_HscMQuuY9ABYNF7PI76-qJYs

## Check out these tools

Enjoy this tool? Check out these other awesome tools [Foundry](https://github.com/foundry-rs/foundry/tree/master/forge), [viem](https://viem.sh), [abitype](https://abitype.dev/), [ethereumjs-monorepo](https://github.com/ethereumjs/ethereumjs-monorepo), [wagmi](https://wagmi.sh/react/comparison), [Verifiable rpc](https://github.com/liamzebedee/eth-verifiable-rpc), [Optimism (I work here)](https://github.com/ethereum-optimism/optimism), [helios](https://github.com/a16z/helios)
