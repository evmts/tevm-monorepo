# evmts (experimental)

experimental evm based library to use forge scripts in clientside code

1. Write a forge-like script

```solidity
// src/TransferAllMutation.s.sol
pragma solidity ^0.8.17;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Script} from "@evmts/contracts/Script";

contract TransferAllMutation is Script {
  function run() external {
    uint256 signerPublicKey = vm.envUint("SIGNER");
    ERC20 tokenContract = new ERC20(vm.envUint("TOKEN_ADDRESS"));
    uint256 tokenBalance = tokenContract.balanceOf(signerPublicKey);
    uint256 to = vm.envUint("TO");

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

## Getting started

**described features not implemented**

This software is being developed with [documentation driven development](https://gist.github.com/zsup/9434452) and described features may not be implemented. Also it's name once released will not be evmts (most likely)

**this software is not ready for production use**

This is experimental exploratory software that should not be used in a production setting

### Installation

Install `@evmts/core` and it's peer dependencies

```bash
npm i @evmts/core @evmts/contracts wagmi ethers forge-std
```

Ts-sol keeps itself peformant with regard to peformance and bundle size while also providing an optimal developer api via it's build tool. A plugin will need to be added to your vite, rollup, or webpack config to use evmts.

#### Vite installation

Install rollup plugin

```bash
npm i @evmts/plugin-rollup
```

Add to your vite config

```typescript
import { tsSolPlugin } from '@evmts/plugin-rollup`
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tsSolPlugin()]
})
```

Or add to rollup config

```typescript
const { tsSolPlugin } = require('@evmts');

module.exports = {
  ...
  plugins: [tsSolPlugin()]
};
```

#### Next.js / Create React App / Webpack installation

Install webpack plugin

```bash
npm i @evmts/plugin-webpack
```

And then add to your webpack config

```typescript
import TsSolPlugin from '@evmts/plugin-webpack'

...
plugins: [
 new TsSolPlugin()
]
```

## API

### Solidity API

As of now evmts implements the forge api but is not actually using forge at runtime.

The only implemented forge cheat codes in this version are the [envString](https://book.getfoundry.sh/cheatcodes/env-string) and [envUint](https://book.getfoundry.sh/cheatcodes/env-uint). We also add `vm.prepareBroadcast` which is similar to forges [startBroadcast](https://book.getfoundry.sh/cheatcodes/start-broadcast).

Whatever is returned from the function is also returned in the typescript code is ran.

Note there is fundamentally no difference between queries and mutations other than semantic. It is a best practice to only mutate on state with mutations and use queries if only reading state

```solidity
# src/TransferAllMutation.s.sol
pragma solidity ^0.8.17;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Script} from "@evmts/contracts/Script";

contract TransferAllMutation is Script {
  function run() external returns (bool memory) {
    uint256 signerPublicKey = vm.envUint("SIGNER");
    ERC20 tokenContract = new ERC20(vm.envUint("TOKEN_ADDRESS"));
    uint256 tokenBalance = tokenContract.balanceOf(signerPublicKey);
    uint256 to = vm.envUint("TO");

    vm.prepareBroadcast(signerPublicKey);
    bool success = tokenContract.transfer(signer, tokenBalance);
    vm.stopPrepareBroadcast();

    return success
  }
}
```

### Typescript API

The typescript api borrows heavily from [@wagmi/core]https://www.npmjs.com/package/@wagmi/core). There are fundamentally two types of tx. Queries, and mutations.

#### query

To use the query action simply pass the query and the env variables into the query. PROVIDER is required. Whatever is returned from the solidity script will be returned from the query.

```typescript
import { MyQuery } from './MyQuery.t.sol'
import { query } from '@evmts/core'
import ethers from 'ethers'

const provider = new ethers.providers.JSONRpcProvider(process.env.RPC_URL)

try {
  const queryResult = query(MyQuery, {
    env: {
      PROVIDER: provider,
    },
  })
} catch (e) {
  console.error(e)
}
```

Available Options are based on [tanstack query's api](https://tanstack.com/query/latest/docs/react/reference/QueryClient#queryclientfetchquery). The available only available option in this version is `refetchInterval` which will run the query on a polling interval.

The difference between queries and mutations is mostly semantic but queries will ignore and no-op any attempted mutations.

### prepareMutate and mutate

See [wagmi docs](https://wagmi.sh/react/prepare-hooks) for why this library seperates preparing a mutation from sending one.

To prepare a mutation it's just like the query hook. Only difference is SIGNER is required rather than PROVIDER. Use gasLimit and expectedEvent to provide optimal ux for your users.

```typescript
import { TransferAllMutation } from './TransferAllMutation.s.sol'
import { prepareMutate, mutate } from '@evmts/core'
import detectEthereumProvider from '@metamask/detect-provider'
import addresses from './my-constants/addresses'

const signer = await detectEthereumProvider()

const prepareConfig = await prepareMutate(TransferAllMutation, {
  env: {
    CHAIN_ID: 10,
    SIGNER: signer,
    TOKEN_ADDRESS: addresses.myToken,
    TO: addresses.someOtherWallet,
  },
})

console.log(prepareConfig.gasLimit) // the gas limit as a javascript BigNumber
console.log(prepareConfig.expectedEvents) // events triggered by the simulated tx
console.log(prepareConfig.mode) // returns 'prepared'
console.log(prepareConfig.chainId) // the chain id

const result = await mutate(prepareConfig)

console.log(result.txHash)
console.log(result.mode) // returns 'submitted'
console.log(result.chainId) // returns the chainId
console.log(result.gasLimit) // returns the gas limit
conosole.log(result.gasUsed) // returns the gas used
```

If a different chain than what the provider or signer is connected to it will automatically request the user to switch chains when mutate is called.

## How it works

### POC 0

1. A babel plugin replaces solidity template strings with an object containing the abi and the bytecode. Then at runtime the
2. [ethereum js](https://github.com/ethereumjs/ethereumjs-monorepo) will execute the bytecode at runtime. The code is mostly copy pasted from their examples.

### Future versions including POC 0 and the MVP v0

1. The rollup/webpack plugin will use forge under the hood in a temporary directory to compile all your projects contracts into bytecode and abis.
2. A lightly modified version of [ethereum js](https://github.com/ethereumjs/ethereumjs-monorepo) will execute the bytecode at runtime.

### Node.js

Node is currently not officially supported (yet) as this is being built specifically to address clientside problems. But it could be used in node via using the Rollup plugin.

## Future Roadmap

The future roadmap will be mostly determined by the community feedback and reaction from the second POC and the productionized MVP. [Open a discussion](https://github.com/evmts/evmts-monorepo/discussions) if you have any feedback

### evmts POC - 1 (nearing completion)

POC 1 is a quick and dirty poc put together through the weekend

### evmts POC - 2 (in design)

POC 2 is in progress and is meant to show off the full power of evmts. Some sublibraries of it such as the rollup plugin (covered later) may be production ready.

### evmts MVP (not started)

The mvp will have an unstable api but be production ready. If POC 2 is good we will be looking for contributors for the MVP. No contribution is too small.

### evmts V0 (not started)

V0 will be the first stable API

### V1 (not started)

After V0 is out for a while V1 will improve upon V0 based on community feedback

### indexer project

A future project to implement a forge-like syntax for building backend indexers purely with solidity and forge. Unlike evmts it will extend forge rather than reimplement it's api.

### decentralization/trustless roadmap

The belief is that this solidity-like syntax will plug into the [OP Stack](https://optimism.mirror.xyz/fLk5UGjZDiXFuvQh6R_HscMQuuY9ABYNF7PI76-qJYs) and a [light client](https://a16zcrypto.com/building-helios-ethereum-light-client/) will open the door for evmts to become a building block for trustless frontends. The tech is not ready yet though and for now evmts is focusing on developer experience.

### Packages (aka where is the code?)

## playground

[packages/playground](https://github.com/evmts/evmts-monorepo/tree/main/apps/playground) is a simple vite app used to test and develop on evmts e2e.

## evmts (POC 0)

[packages/core](https://github.com/evmts/evmts-monorepo/tree/main/packages/core) is where the code for the POC 1 typescript library lives. There is no solidity code because POC 1 doesn't support cheat codes nor does it support reading from a live network. It only executes simply solidity code such as returning 'hello world'.

POC 1 unlike future versions of evmts operates with template strings

```typescript
import { evmts } from '@evmts/core'

const query = evmts`
contract Script {
    function run() external returns (string memory) {
        return "Hello, World!";
    }
}
`
```

## babel-plugin-sol (POC 0)

[packages/babel-plugin-sol](https://github.com/evmts/evmts-monorepo/tree/main/packages/babel-plugin-sol) is where the code for the POC 1. It uses forge in a temporary directory to replace the template string with an object containing the byte code and the json abi

## @evmts/core (POC 2)

Currently in design

## @evmts/plugin-rollup (POC 2)

Currently in design

## @evmts/plugin-webpack (POC 2)

Currently in design

## @evmts/create (POC 2)

Currently in design. Will just be a simple evmts react app for anybody who wants to try out evmts.

## Contributing

TODO
