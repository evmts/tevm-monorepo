---
title: Quick start guide
description: Tevm introduction
---

# Tevm Quick Start Guide

After going through this guide you will understand the basic functionality of Tevm.

:::tip
🚧 If you are already familiar with how Tevm works you can bootstrap a project with the tevm cli (Coming soon)

```bash
npm create tevm my-app
```

If you are not familiar with Tevm we recomend you go through the tutorial to set up a new project from scratch
:::

## Introduction

This guide will get you familiar with the most essential features of Tevm and start interacting with the Ethereum Virtual Machine (EVM) in Node.js or browser environments with `Tevm`. By the end of this guide you will understand:

1. How to create a forked EVM in JavaScript using [`createMemoryClient`](/reference/tevm/memory-client/functions/creatememoryclient)
2. How to write, build, and execute solidity scripts with a [`TevmClient`](/reference/tevm/client-types/type-aliases/tevmclient)
3. How to streamline your workflow using [`tevm contract imports`](/reference/tevm/bun-plugin/functions/bunplugintevm) with the tevm bundler
4. How to write solidity scripts with the [`tevm script action`](/reference/tevm/client-types/type-aliases/tevmclient#script)

## Prerequisites

- [Bun](https://bun.sh/).

This tutorial uses Bun but you can follow along in [Node.js >18.0](https://nodejs.org/en) as well. Bun can be installed with NPM.

```bash
npm install --global bun
```

For more details visit the [Bun Installation Guide](https://bun.sh/docs/installation).

## Creating Your Tevm Project

1. Create a new project directory:

```bash
mkdir tevm-app && cd tevm-app
```

2. Initialize your project with [bun init](https://bun.sh/docs/cli/init):

```bash
bun init
```

3. Install tevm

```bash
bun install tevm
```

## Creating a Tevm VM

Now let's create a Tevm VM to execute Ethereum bytecode in our JavaScript

1. Open the index.ts file

2. Now initialize a [MemoryClient](/reference/tevm/memory-client/type-aliases/memoryclient) with [createMemoryClient](/reference/tevm/memory-client/functions/creatememoryclient)

```typescript
import { createMemoryClient } from 'tevm';

const tevm = await createMemoryClient();
```

This initializes an an ethereum VM instance akin to starting anvil but in memory.

## Using ethereum JSON-RPC

The entrypoint to using Tevm is [`TevmClient.request`](/reference/tevm/procedures-types/type-aliases/tevmjsonrpcrequesthandler). It implements the

- much of the [ethereum JSON-RPC](https://ethereum.org/en/developers/docs/apis/json-rpc)
- custom [tevm_*](/reference/tevm/procedures-types/type-aliases/tevmjsonrpcrequest) requests
- will support anvil_* and ganache_* in future versions

Let's use [eth_getBalance](https://ethereum.org/en/developers/docs/apis/json-rpc#eth_getbalance)

1. Create a [eth_getBalance](/reference/tevm/procedures-types/type-aliases/ethgetbalancejsonrpcrequest)

```typescript
import { createMemoryClient } from 'tevm';
import { EthGetBalanceRequest } from 'tevm'

const tevm = await createMemoryClient();

const request: EthGetBalanceRequest = {
  jsonrpc: '2.0',
  id: 1,
  method: 'eth_getBalance',
  params: ["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"]
}
```

2. Now pass our request into [`@tevm/request`](/reference/tevm/client-types/type-aliases/tevmclient#request)

```typescript
import { createMemoryClient } from 'tevm';
import { EthGetBalanceRequest } from 'tevm'

const tevm = await createMemoryClient();

const request: EthGetBalanceRequest = {
  jsonrpc: '2.0',
  id: 1,
  method: 'eth_getBalance',
  params: ["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"]
}

const response = await tevm.request(request)

console.log(response.error)
console.log(response.result)
```

3. Now run it

```bash
bun run index.ts
```

This address has 0 eth because we have a brand new vm. Let's make our VM fork ethereum now.

## Forking a live network

Similar to anvil or ganache `Tevm` has the ability to fork a live network.

1. Update [createMemoryClient](/reference/tevm/memory-client/functions/creatememoryclient) to fork ethereum using [forkUrl](/reference/tevm/memory-client/type-aliases/createevmoptions)

Add any ethereum RPC url to the [`options.fork.url`](/reference/tevm/memory-client/type-aliases/createevmoptions)

```typescript
import { createMemoryClient } from 'tevm';
import { EthGetBalanceRequest } from 'tevm'

const tevm = await createMemoryClient({
  fork: {
    url: 'https://mainnet.optimism.io'
  }
});

const request: EthGetBalanceRequest = {
  jsonrpc: '2.0',
  id: 1,
  method: 'eth_getBalance',
  params: ["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"]
}

const response = await tevm.request(request)

console.log(response)
```

Tevm will fork latest block by default.

Now run script again vs the forked network

```bash
bun run index.js
```

This is equivelent to issuing a JSON-RPC request directly to the RPC

```typescript
fetch("https://mainnet.optimism.io", {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_getBalance',
    params: ["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"]
  })
})
  .then(response => response.json())
  .then(console.log);
```

But with [`MemoryClient`](/reference/tevm/memory-client/type-aliases/memoryclient) all requests will be issued to the same block number we forked and cached in memory once made.

## Using `Actions` API to execute a contract

Tevm exposes a [viem-like](https://viem.sh) `actions api` to provide a higher level of abstraction than the JSON-RPC interface.

1. Replace [`tevm_getAccount` JSON-RPC procedure](/reference/tevm/procedures-types/type-aliases/getaccountjsonrpcprocedure) with the [getAccount action](/reference/tevm/actions-types/type-aliases/getaccounthandler)

```typescript
import { createMemoryClient } from 'tevm';
- import { EthGetBalanceRequest } from 'tevm'

const tevm = await createMemoryClient({
  fork: {
    url: 'https://mainnet.optimism.io'
  }
});

- const request: EthGetBalanceRequest = {
-   jsonrpc: '2.0',
-   id: 1,
-   method: 'eth_getBalance',
-   params: ["0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"]
- }
+ const address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"

- const response = await tevm.request(request)
+ const result = await tevm.eth.getBalance({address})

- console.log(response)
+ console.log(result)
```

2. Handle errors

Let's see what happens when we throw an error

```typescript
const {errors} = await tevm.setAccount({address: '0xnot a valid address', balance: BigInt(0)})
console.log(errors)
```

All tevm actions return errors as values. They do not every throw. This is consistent with the JSON-RPC api.

:::tip
All error types are available in the `tevm/errors` subpackage. Errors are strongly typed with a `name` property.
:::

3. Run a transaction

Now send a transaction using [TevmClient.call](/reference/tevm/client-types/type-aliases/tevmclient#call). This is equivelent to using [`eth_call`](/reference/tevm/procedures-types/type-aliases/ethcalljsonrpcprocedure).

`Tevm.call` wraps `tevm_call` which is similar to `eth_call` or `Tevm.eth.call` but has extra parameters for modifying the VM.

```typescript
import { createMemoryClient, parseEth } from 'tevm';

const tevm = await createMemoryClient({
  fork: {
    url: 'https://mainnet.optimism.io'
  }
});

const fromAddress = `0x${'01'.repeat(20)}` as const
const toAddress = `0x${'02'.repeat(20)}` as const

// skipBalanceCheck will mint any eth if account has less than 0
await tevm.call({
  from: fromAddress,
  to: toAddress,
  value: parseEth('1'),
  skipBalanceCheck: true
})

const balance = await tevm.eth.balanceOf({address: toAddress})
console.log(balance)
```

4. Now run script again to see the expected result of running the contract call.

```bash
bun run vm.js
```

To see more options check out [CallParams](/reference/tevm/actions-types/type-aliases/callparams) docs

## Executing contract calls

We can execute a contract call by sending encoded contract data just like [`eth_call`](/reference/tevm/procedures-types/type-aliases/ethcalljsonrpcprocedure)

1. Use [`encodeFunctionData`](/reference/tevm/contract/functions/encodefunctiondata) to pass in a contract call to [`tevm.call`](/reference/tevm/client-types/type-aliases/tevmclient#call)

```typescript
import { createMemoryClient, encodeFunctionData, decodeFunctionData, parseAbi } from 'tevm';

const tevm = await createMemoryClient({
  fork: {
    url: 'https://mainnet.optimism.io'
  }
});

const abi = parseAbi(['function balanceOf(address owner) returns (uint256 balance)'])

const owner = `0x${'01'.repeat(20)}` as const
const contractAddress = `0x${'02'.repeat(20)}` as const

const {rawData} = await tevm.call({
  to: contractAddress,
  data: encodeFunctionData({
    args: [owner]
    functionName: 'balanceOf',
    abi,
  })
})

const balance = decodeFunctionData({
  functionName: 'balanceOf',
  abi,
  data: rawData
})
console.log(balance)
```

2. Use `TevmClient.contract`

Rather than encoding and decoding data with `TevmClient.call` we can instead use the [`TevmClient.contract`](/reference/tevm/client-types/type-aliases/tevmclient#contract) method. It wraps the `eth_call` JSON-rpc method and matches much of [viems readContract](https://viem.sh/docs/contract/readContract.html) API but with some extra VM control. 

Refactor our call to use `Tevm.contract`

```typescript
import { createMemoryClient, parseAbi } from 'tevm';

const tevm = await createMemoryClient({
  fork: {
    url: 'https://mainnet.optimism.io'
  }
});

const owner = `0x${'01'.repeat(20)}` as const
const contractAddress = `0x${'02'.repeat(20)}` as const

const {data: balance} = await tevm.contract({
  to: contractAddress,
  args: [owner],
  functionName: 'balanceOf',
  abi: parseAbi(['function balanceOf(address owner) returns (uint256 balance)']),
})

console.log(balance)
```

## Scripting with Tevm

In the previous section we called the [`Dai`](https://optimistic.etherscan.io/token/0xda10009cbd5d07dd0cecc66161fc93d7c9000da1) which is deployed to optimism. But Tevm can also execute arbitrary contracts that are not deployed.

We could use the `tevm.setAccount` feature to deploy bytecode

```typescript
await tevm.setAccount({address: `0x${'42'.repeat(20)}`, deployedBytecode: '0x000'})
```

And then use `tevm.contract` as we did in last section.

But Tevm provides a convenient [`tevm_script`](/reference/tevm/procedures-types/type-aliases/scriptjsonrpcprocedure) JSON-RPC request and matching [TevmClient.script action](/reference/tevm/client-types/type-aliases/tevmclient#script)

1. First let's make a new solidity file

```bash
touch HelloWorld.s.sol
```

2. Next write a simple HelloWorld contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

contract HelloWorld {
    function greet(string memory name) public pure returns (string memory) {
        return string(abi.encodePacked("Hello ", name));
    }
}
```

We now need a way of turning our contract into bytecode.

3. 🚧 Use Tevm to compile the contract into bytecode and abi (not yet implemented but will be soon)

```bash
bunx tevm compile HelloWorld.s.sol
```

You should see a `.js` file get generated with the JavaScript version of your contract. Inspect the file. We will talk more about this later.

4. Import contract and use it in a [`Tevm.script`](/reference/tevm/client-types/type-aliases/tevmclient#script) action.

```typescript
import { HelloWorld } from './HelloWorld.s.sol.js';
import { createMemoryClient, encodeFunctionData, parseAbi } from 'tevm';

const tevm = await createMemoryClient({
  fork: {
    url: 'https://mainnet.optimism.io'
  }
});

const scriptResult = await tevm.script({
  abi: HelloWorld.abi,
  deployedBytecode: HelloWorld.deployedBytecode,
  functionName: 'greet',
  args: ['Vitalik'],
});

console.log(scriptResult.data); // Hello Vitalik!
```

Now run the script

```bash
bun run script.js
```

## Working with Contract Action Creators

Tevm offers an streamlined typesafe dev experience for working with solidity scripts and contracts via `TevmContracts`.

`TevmContracts` are created via using the `createContract` method. You may have noticed it being used in the `HelloWorld.s.sol.js` file.

Let's refactor our script code to take advantage of tevm contracts `actionCreators`.

```typescript
- const scriptResult = await tevm.script({
-   abi: HelloWorld.abi,
-   functionName: 'greet',
-   args: ['Vitalik'],
-   deployedBytecode: HelloWorld.deployedBytecode
- });
+ const scriptResult = await tevm.script(
+   HelloWorld.read.greet('Vitalik')
+ );
```

## Build Contracts and scripts directly from JavaScript imports

Remember before we used `tevm generate` to generate JavaScript from our contract. Tevm offers tooling to do this automatically. After installing this tooling you can simply just import your contract directly.

```typescript
import {HelloWorld} from './MyContract.sol'
```

This direct solidity import will be recognized by Bun and Tevm at build time and automatically generate the JavaScript and typescript types behind the scene. You will also get enhanced `LSP` support in your editors such as Vim or VSCode. This includes

- Instant update whenever the contract changes without an additional generation step
- Great typesafety
- Go-to-definition taking you directly to the solidity line of code a given method is defined
- Natspec definitions on hover

First let's configure Bun to recognize solidity files

1. Install the `@tevm/bundler` package

```bash
bun install @tevm/bundler
```

This package installs two tools we need:

- Bundler support to bundle our solidity contracts. Plugins exist for webpack, vite, rollup, esbuild and more. We will use the [bun plugin](/reference/tevm/bun-plugin/functions/bunplugintevm).
- [LSP](https://microsoft.github.io/language-server-protocol/) support for TypeScript via a [typescript language service plugin](https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin)


2. Create a `plugin.js` file to install the `Tevm bun plugin` into Bun

```typescript
import { tevmBunPlugin } from '@tevm/bundler/bun-plugin';
import { plugin } from 'bun';

plugin(tevmBunPlugin({}));
```

3. Now add the `plugin.js` file to the `bunfig.toml` to tell bun to load our plugin in normal mode and dev mode

```toml
preload = ["./plugins.js"]
[test]
preload = ["./plugins.js"]
```

4. Remove the generated files from before

```bash
rm -rf HelloWorld.sol.js HelloWorld.sol.d.ts
```

5. Now rerun bun

```bash
bun run script.ts
```

You will see bun still generated the same files and cached them in the `.tevm` folder this time. The plugin is taking care of this generation for you whenever you run bun.

6. Configure the TypeScript LSP

Though bun is working you may notice your editor is not recognizing the solidity import. We need to also configure the TypeScript language server protocol that your editor such as `VIM` or `VSCode` uses.

Add `{"name": "@tevm/bundler/ts-plugin"}` to `compilerOptions.plugins` array to enable tevm in typescript language server.

```json
{
  "compilerOptions": {
    "plugins": [
      {"name": "@tevm/plugin/ts-plugin"}
    ]
  }
}
```

Note: ts-plugins only operate on the language server. Running `tsc` from command line will still trigger errors on solidity imports. A command line tool for this is coming soon. 

## Use external contracts

Contracts from external repo can be used via installing with npm.

```bash
bun install @openzeppelin/contracts -D
```

You can now use any common contract implementation in your code via extending the contracts or importing them directly into JavaScript.

The following executes a ERC721 balanceOf call against a forked contract on mainnet.

```typescript
import { ERC721 } from '@openzeppelin/contracts/tokens/ERC721/ERC721.sol'
import { createMemoryClient } from './vm.js'

// Note it is recomended to use a more reliable rpc provider than the free tier cloudflare rpc
const result = await createMemoryClient({fork: {url: 'https://cloudflare-eth.com'}}).contract(
  ERC721
    .withAddress('0x5180db8F5c931aaE63c74266b211F580155ecac8')
    .balanceOf(' 0xB72900a2e885dF6A2824969B6e40B969C8ae3CB7')
)
console.log(result)
```

## Summary

Congrats. You now have learned all the basics you need to start building with `Tevm`. Consider [joining the telegram](https://t.me/+ANThR9bHDLAwMjUx) to discuss Tevm.
