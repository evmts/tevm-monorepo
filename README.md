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

# evmts

Evmts is a collection of open source libraries and experimental evm based packages and apps by evmts.

[docs/evmts](https://github.com/evmts/evmts-monorepo-monorepo/tree/main/docs/evmts) for more.

## Basic usage

1. Write a forge-like script

```solidity
// src/TransferAllMutation.s.sol
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
// src/index.ts
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

See [docs/evmts](https://github.com/evmts/evmts-monorepo-monorepo/tree/main/docs/evmts) for more.

## Getting started with monorepo

See [docs/monorepo](https://github.com/evmts/evmts-monorepo-monorepo/tree/main/docs/monorepo)
