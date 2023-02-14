<p align="center">

  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/35039927/218812217-92f0f784-cb85-43b9-9ca6-e2b9effd9eb2.png">
    <img alt="wagmi logo" src="https://user-images.githubusercontent.com/35039927/218812217-92f0f784-cb85-43b9-9ca6-e2b9effd9eb2.png" width="auto" height="300">
  </picture>
</p>

<p align="center">
  Execute solidity scripts in browser
<p>

[![CI](https://github.com/evmts/evmts-monorepo/actions/workflows/tests.yml/badge.svg)](https://github.com/evmts/evmts-monorepo/actions/workflows/tests.yml)
[![CI](https://github.com/evmts/evmts-monorepo/actions/workflows/lint.yml/badge.svg)](https://github.com/evmts/evmts-monorepo/actions/workflows/lint.yml)
[![CI](https://github.com/evmts/evmts-monorepo/actions/workflows/typecheck.yml/badge.svg)](https://github.com/evmts/evmts-monorepo/actions/workflows/typecheck.yml)
[![CI](https://github.com/evmts/evmts-monorepo/actions/workflows/docker.yml/badge.svg)](https://github.com/evmts/evmts-monorepo/actions/workflows/docker.yml)
[![CI](https://github.com/evmts/evmts-monorepo/actions/workflows/npm.yml/badge.svg)](https://github.com/evmts/evmts-monorepo/actions/workflows/npm.yml)
<a href="https://twitter.com/fucory">
<img alt="Twitter" src="https://img.shields.io/twitter/url.svg?label=%40fucory&style=social&url=https%3A%2F%2Ftwitter.com%2Ffucory" />
</a>
<a href="https://gitmoji.dev">
<img
    src="https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat-square"
    alt="Gitmoji"
  />
</a>
<a href="https://www.npmjs.com/package/@evmts/core" target="\_parent">
<img alt="" src="https://img.shields.io/npm/dm/@evmts/core.svg" />
</a>
<a href="https://bundlephobia.com/package/@evmts/core@latest" target="\_parent">
<img alt="" src="https://badgen.net/bundlephobia/minzip/@evmts/core" />
</a><a href="#badge">

# evmts-monorepo

evmts enables direct evm execution clientside with forge cheat codes and direct solidity file imports.

## Visit [Docs (under construction)](https://evmts-docs-fx6udvub5-evmts.vercel.app/en/getting-started) for docs, guides, API and more!

## Packages and apps

[packages](https://github.com/evmts/evmts-monorepo/tree/main/packages)

- [@evmts/core](https://github.com/evmts/evmts-monorepo/tree/main/packages/core) is the core typescript library for evmts
- [@evmts/contracts](https://github.com/evmts/evmts-monorepo/tree/main/packages/contracts) contains all contract code for evmts
- [@evmts/plugin-vite](https://github.com/evmts/evmts-monorepo/tree/main/packages/plugin-vite) contains the vite plugin
- [@evmts/plugin-rollup](https://github.com/evmts/evmts-monorepo/tree/main/packages/plugin-rollup) contains the rollup plugin
- [@evmts/plugin-webpack](https://github.com/evmts/evmts-monorepo/tree/main/packages/plugin-webpack) contains the webpack plugin

[apps](https://github.com/evmts/evmts-monorepo/tree/main/apps)

- [@evmts/playground](https://github.com/evmts/evmts-monorepo/tree/main/apps/playground) contains an example vite app for developing on evmts
- [@evmts/e2e](https://github.com/evmts/evmts-monorepo/tree/main/apps/e2e) contains e2e tests that run against all example apps
- [@evmts/docs](https://github.com/evmts/evmts-monorepo/tree/main/apps/docs) contains the docs astro app

## Getting started

See [docs/evmts](https://github.com/evmts/evmts-monorepo-monorepo/tree/main/docs/evmts) for installation and and more detailed usage documentation.

See [docs/monorepo](https://github.com/evmts/evmts-monorepo-monorepo/tree/main/docs/monorepo) for documentation on how to execute the monorepo with nx

See [docs/contributing](https://github.com/evmts/evmts-monorepo-monorepo/tree/main/docs/contributing) for documentation on how to contribute to evmts. No contribution is too small

## Basic usage

**These features are not yet implemented. Watch this repo for release updates**

1. Write a forge-like script

```solidity
pragma solidity ^0.8.17;

import { ERC20 } from '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import { Script } from '@evmts/contracts/Script';

contract TransferAllMutation is Script {
  function run() external {
    uint256 signerPublicKey = vm.envUint('SIGNER');
    ERC20 tokenContract = new ERC20(vm.envUint('TOKEN_ADDRESS'));
    uint256 tokenBalance = tokenContract.balanceOf(signerPublicKey);
    uint256 to = vm.envUint('TO');

    vm.prepareBroadcast(signerPublicKey);
    tokenContract.transfer(signer, tokenBalance);
    vm.stopPrepareBroadcast();
  }
}
```

2. Now execute that script in your clientside typescript code

```typescript
import { TransferAllMutation } from './TransferAllMutation.s.sol'
import { prepareMutate, mutate } from '@evmts/core'
import detectEthereumProvider from '@metamask/detect-provider'
import addresses from './my-constants/addresses'

const signer = await detectEthereumProvider()

const prepareConfig = await prepareMutate(TransferAllMutation, {
  env: {
    SIGNER: signer,
    TOKEN_ADDRESS: addresses.myToken,
    TO: addresses.someOtherWallet,
  },
})

console.log(prepareConfig.gasLimit)
console.log(prepareConfig.expectedEvents)

const result = await mutate(prepareConfig)

console.log(result.txHash)
```

## Authors

- Will Cory ([@fucory](https://twitter.com/fucory))

## Security

If you believe you have found a security vulnerability we encourage you to responsibly disclose this and not open a public issue. We will investigate all legitimate reports. Email `will@oplabs.co` to disclose any security vulnerabilities.

## Contributing

Please see our [contributing.md](/docs/contributing.md).

## 🚧 WARNING: UNDER CONSTRUCTION 🚧

**This project is work in progress and subject to frequent changes**
**This is experimental software not for production use**

Looking to get started building a production-ready dapp? Check out wagmi cli: https://wagmi.sh/cli/create-wagmi. <br />
Interested in the OP stack and this projects **decentralization roadmap**? You should be! Check out op stack blog here: https://optimism.mirror.xyz/fLk5UGjZDiXFuvQh6R_HscMQuuY9ABYNF7PI76-qJYs

## Check out these tools

Enjoy this tool? Check out these other awesome tools [Foundry](https://github.com/foundry-rs/foundry/tree/master/forge), [ethereumjs-monorepo](https://github.com/ethereumjs/ethereumjs-monorepo), [wagmi](https://wagmi.sh/react/comparison), [Verifiable rpc](https://github.com/liamzebedee/eth-verifiable-rpc), [Optimism (I work here)](https://github.com/ethereum-optimism/optimism), [helios](https://github.com/a16z/helios)
