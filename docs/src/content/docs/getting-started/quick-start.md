---
title: Quick start guide
description: Tevm introduction
---

# Tevm Quick Start Guide

## Introduction

We will be creating a simple counter app using TypeScript and html.

This guide will get you familiar with the most essential features of Tevm.

We will be creating a project from scratch so we understand every piece.

## Prerequisites

This tutorial uses [Node.js >18.0](https://nodejs.org/en) and assumes basic knowledge of [JavaScript](https://www.youtube.com/watch?v=g7T23Xzys-A), [solidity](https://docs.soliditylang.org/en/v0.8.25/), and [viem](https://viem.sh)

Make sure you have a compatable version of node

```bash
node --version
```

## Creating Your Tevm Project

1. Create a new project directory:

We will be doing everything from scratch so we understand where each piece comes from.

```bash
mkdir tevm-app && cd tevm-app
```

2. Initialize your project with npm init:

```bash
npm init --yes
```

3. Install `tevm` and `viem` as runtime dependencies

The recomended way to use `tevm` is as a a viem transport.

```bash
npm install tevm viem
```

4. Install `vite` and `typescript` as buildtime dependency

Vite will provide us a pretty minimal setup to import TypeScript into our HTML

```bash
npm install --save-dev vite typescript
```

## Scaffold the initial project

We are going to be using a minimal vanilla setup with no framework.

1. Create a tsconfig

The following config works quite nicely with vite apps.

Feel free to use any tsconfig you prefer but make sure it supports bigint and is in strict mode.

See the [tsconfig docs](https://www.typescriptlang.org/tsconfig) for more information about these options.

```bash
echo '{
  "compilerOptions": {
    "target": "ES2021",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2021", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}' > tsconfig.json

```

2. Create an html file

The HTML file will be the entrypoint to our app. Add it to `index.html`

```bash
echo '
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tevm Example</title>
</head>

<body>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
</body>

</html>
' > index.html
```

You will see it is importing a `src/main.ts` file in a script tag. Go ahead and add that too

```bash
mkdir src && echo '
const app = document.querySelector("#app") as Element;
app.innerHTML = "<div>Hello Tevm</div>";
' > src/main.ts
```

Now double check that you can run your application

```bash
npx vite .
```

Hit `o` key and then `<Enter>` to open up [`http://localhost:5173`](http://localhost:5173) in your browser

You should see `Hello Tevm` rendered

Consider adding this command to your package.json for convenience

```json
"scripts": {
  "dev": "npx vite ."
}
```

3. Add pollyfills

To use Tevm and viem in the browser it is necessary to add some polyfills. These will inject code into your final build that will allow apis that do not exist in the browser natively to work.

First install polyfill librarys to polyfill `node`

```bash
npm i --save-dev vite-plugin-node-polyfills
```

Then create a basic vite config. This will build our app with ['stream'](https://nodejs.org/api/stream.html), ['process'](https://nodejs.org/api/process.html), ['Buffer'](https://nodejs.org/api/buffer.html), and ['global'](https://nodejs.org/api/globals.html) polyfills

If you are using Tevm in node.js or bun no polyfills are necessary. Over time tevm has been and will continue to remove the need for polyfills.

```
echo '
import { defineConfig } from "vite"
import { nodePolyfills } from "vite-plugin-node-polyfills"

// https://vitejs.dev/config/
export default defineConfig({
	define: {
		global: "globalThis",
	},
	plugins: [
		nodePolyfills({
			include: ["stream"],
			globals: {
				process: true,
				Buffer: true,
				global: true,
			},
		}),
	],
})
' > vite.config.js
```

Restart your vite server.

## Create memory client

Now let's create a MemoryClient. A memory client is a [viem client](https://viem.sh/docs/clients/intro.html) using an in-memory [transport](https://viem.sh/docs/clients/intro#transports). This means instead of sending requests to a RPC provider like alchemy it will be processing requests with tevm in memory in a local EVM instance running in JavaScript.

Memory client is similar to `anvil` it can

- Optionally fork an existing network
- Run special scripts that have advanced functionality
- Extremely hackable. Can mint yourself eth, run traces, or modify storage

1. In the `src/main.ts` file initialize a [MemoryClient](/reference/tevm/memory-client/type-aliases/memoryclient) with [createMemoryClient](/reference/tevm/memory-client/functions/creatememoryclient)

```typescript
import { createMemoryClient } from "tevm";

const app = document.querySelector("#app") as Element;

const memoryClient = createMemoryClient({
  fork: {
    // Note: we may face throttling using the public endpoint
    url: "https://mainnet.optimism.io",
  },
});

async function runApp() {
  app.innerHTML = `<div id="status">initializing...</div>
<div id="blocknumber"></div>
`;
  const status = app.querySelector("#status")!;

  status.innerHTML = "Fetching block number...";

  const blockNumber = await memoryClient.getBlockNumber();
  document.querySelector("#blocknumber")!.innerHTML =
    `ForkBlock: ${blockNumber}`;

  status.innerHTML = "Done";
}

runApp();
```

When we fork a network the blocknumber will be pinned to the block number at the time of the fork. As you mine new blocks you will not get updates from the chain unless you refork it.

:::caution[Tevm performance]
Currently it is known that Tevm is pretty slow especially when the fork url is slow. Currently tevm is focused on feature completeness and correctness. Performance improvements will come after stable 1.0.0 release.

Consider using an authenticated RPC url to help speed up performance.
:::

## Viem client API

Because the tevm client is a viem client it has access to most of the [public viem actions api](https://viem.sh/docs/actions/public/introduction) as well as [test actions](https://viem.sh/docs/actions/test/introduction)

Wallet actions are not yet supported but will receive support in a later version of tevm. Don't worry though, you can still create transactions using the custom tevmActions.

Refer to viem docs for more details about how these actions work.

:::caution[Tevm performance]
Not all viem apis have been tested yet though many should work. See this test for an idea of which endpoints have been implemented and validated.

https://github.com/evmts/tevm-monorepo
:::

## Tevm account actions

In addition to the viem api there are also powerful tevm specific actions. Let's start with the account actions

- `tevm.setAccount` will allow us to arbitrarily update any account
- `tevm.getAccount` will allow us to query for a specific account

1. Add a div to add some of our account information

```typescript
app.innerHTML = `<div id="status">initializing...</div>
<div id="blocknumber"></div>
<div style={{display: 'flex', flexDirection: 'horizontal'}}>
  Address: <span id="address"></span>
</div>
<div style={{display: 'flex', flexDirection: 'horizontal'}}>
  Nonce: <span id="nonce"></span>
</div>
<div style={{display: 'flex', flexDirection: 'horizontal'}}>
  Balance: <span id="balance"></span>
</div>
`;
```

2. Add function to update account balance and add it to runApp() {}

You should see it throw an `Account not found` error

```typescript
// addresses and abis must be as const for tevm types
const address = `0x${"0420".repeat(10)}` as const;
async function updateAccount() {
  // we are setting throwOnFail to false because we expect this to throw an error from the account not existing
  const account = await memoryClient.tevmGetAccount({
    address,
    throwOnFail: false,
  });
  if (account.errors) {
    console.error("Unable to get account", account.errors);
    return;
  }
  console.log(account); // console log the account to get familiar with what properties are on it
  document.querySelector("#address")!.innerHTML = address;
  document.querySelector("#nonce")!.innerHTML = String(account.nonce);
  document.querySelector("#balance")!.innerHTML = String(account.balance);
}
// remember to call `await updateAccount()` in runApp()
```

- getAccount will throw if the account is uninitialized (e.g. it has never been touched by the evm)
- Tevm by default will throw if an error happens. It is recomended you use the `throwOnFail: false` property when building production apps to instead return the error as a value.
- if you want to not throw as a default you can pass `throwOnFail: false` to createMemoryClient() (not implemented yet but will be soon)
- Tevm errors are strongly typed though at this moment not every error is accounted for.

Note: there is also a `returnStorage` param that will return all cached storage for a given account if it is a contract. If the contract is forked it will only return the storage tevm knows about and has cached not the entire contract storage on the forked chain.

3. Let's give ourselves some eth to initialize the account

Use `tevmSetAccount` to initialize the account.

```typescript
async function runApp() {
async function runApp() {
app.innerHTML = `<div id="status">initializing...</div>
<div id="blocknumber"></div>
<div style={{display: 'flex', flexDirection: 'horizontal'}}>
  Address: <span id="address"></span>
</div>
<div style={{display: 'flex', flexDirection: 'horizontal'}}>
  Nonce: <span id="nonce"></span>
</div>
<div style={{display: 'flex', flexDirection: 'horizontal'}}>
  Balance: <span id="balance"></span>
</div>
`;
  const status = app.querySelector("#status")!

  status.innerHTML = "Fetching block number..."
  const blockNumber = await memoryClient.getBlockNumber();
  document.querySelector("#blocknumber")!.innerText = `${blockNumber}`;

  status.innerHTML = "Setting account..."
  const setAccountResult = await memoryClient.tevmSetAccount({
    address,
    balance: 420n,
    throwOnFail: false,
  });
  if (setAccountResult.errors) console.error(setAccountResult.errors);

  status.innerHTML = "Updating account..."
  await updateAccount();

  status.innerHTML = "done"
}
```

Now we should see the account balance of 420n and a nonce of 0n.

:::tip[Creating your own client]
In addition to memory client you can also create your own client using lower level primitives like `createTevmTransport` and `tevmActions`. This can be helpful if you prefer to not include actions you aren't going to use or want to add your own actions.

See the [`createMemoryClient`](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/createMemoryClient.js) both for how memory client is constructed and how to build your own client.
:::

## Quick note on prefunded accounts

For convenience the following accounts are prefunded with eth. These are the same accounts anvil and hardhat prefunds.

```
'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
'0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
'0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'
'0x90F79bf6EB2c4f870365E785982E1f101E93b906'
'0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65'
'0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc'
'0x976EA74026E726554dB657fA54763abd0C3a0aa9'
'0x14dC79964da2C08b23698B3D3cc7Ca32193d9955'
'0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f'
'0xa0Ee7A142d267C1f36714E4a8F75612F20a79720'
```

These can be imported from tevm via the `prefundedAccounts` export.

```typescript
import { prefundedAccounts } from "tevm";
console.log(prefundedAccounts[0]);
```

Anytime you create a transaction it will default to the first prefunded account as the msg.sender unless overridden

## Executing the EVM with tevmCall

Tevm can execute the EVM using viem methods such as `memoryClient.call`, `memoryClient.readContract`, `memoryClient.estimateGas`, etc. It also supports some wallet methods such as `eth_sendRawTransaction`. Refer to viem docs for instructions on using the viem api.

Tevm also has it's own powerful method for executing the evm called `tevmCall`. It's like a normal ethereum call but with extra superpowers to do things such as

- create a transaction if succesful
- impersonate any account or contract
- arbitrarily set the call depth
- skip all balance checks

Let's try out tevmCall by sending eth to ourselves from a `prefundedAccount` rather than using setAccount.

```typescript
import { prefundedAccounts } from "tevm";

async function runApp() {
  app.innerHTML = `<div id="status">initializing...</div>
<div id="blocknumber"></div>
<div style={{display: 'flex', flexDirection: 'horizontal'}}>
  Address: <span id="address"></span>
</div>
<div style={{display: 'flex', flexDirection: 'horizontal'}}>
  Nonce: <span id="nonce"></span>
</div>
<div style={{display: 'flex', flexDirection: 'horizontal'}}>
  Balance: <span id="balance"></span>
</div>
`;

  const blockNumber = await memoryClient.getBlockNumber();
  document.querySelector("#blocknumber").innerText = `${blockNumber}`;

  const callResult = await memoryClient.tevmCall({
    // this is the default `from` address so this line isn't actually necessary
    from: prefundedAccounts[0],
    to: address,
    value: 420n,
    throwOnFail: false,
  });
  // aggregate error is a good way to throw an array of errors
  if (callResult.errors) throw new AggregateError(callResult.errors);

  await updateAccount();
}
```

After we run this code we should see an error in our console. The balance never updated even though there are no errors. This is because we just did a normal `call` which executes against the EVM but doesn't actually update any state. This is the default and best used for simply reading the evm. Let's fix this using `createTransaction`.

```typescript
const callResult = await memoryClient.tevmCall({
  // this is the default `from` address so this line isn't actually necessary
  from: prefundedAccounts[0],
  to: address,
  value: 420n,
  // on-success will only create a transaction if the initial run of it doesn't revert
  createTransaction: "on-success",
});
if (callResult.errors) console.error(callResult.errors);
```

We should still see the balance not getting updated. What gives?

Well we did successfully create a transaction which we can see by checking the tx hash

```typescript
console.log(callResult.txHash);
```

If we remove the createTransaction: true the txHash will not be there. However, the transaction has not been mined. It is currently in the mempool. Let's see it using a low level API `getVm()`

```typescript
// the _tevm means this api is not guaranteed to remain stable
const mempool = await memoryClient._tevm.getMempool();
console.log(await mempool.getBySenderAddress());
```

:::tip[Using the low level api]
The low level API on \_tevm is the same API used internally to implement all of tevm. It's api is stable. Tevm believes in remaining maximally hackable and nearly anything you can imagine is possible if you use the low level api.
The actions api is a more streamlined experience however so use the low level api at your own risk.
:::

## Mining blocks

While `cheat` methods like `tevmSetAccount` will immediately update the state for the current block. `call` methods like `tevmCall` will not update the state until a new block is mined.

Currently tevm only supports `manual` mining but in future versions it will support other modes including `automining`, `gasmining` and `intervalmining`. To mine a block simply call `tevm.mine()`

First delete the mempool code and then replace it with a memoryClient.tevmMine()

```typescript
const callResult = await memoryClient.tevmCall({
  // this is the default `from` address so this line isn't actually necessary
  from: prefundedAccounts[0],
  to: address,
  value: 420n,
  createTransaction: true,
});
if (callResult.errors) console.error(callResult.errors);

const mineResult = await memoryClient.tevmMine();
// AggregateError is a good way to combine an array of errors into a single error
if (mineResult.errors) throw new AggregateError(mineResult.errors);
console.log(mineResult.blockHashes);
```

Now that we mined a block we should finally see our account balance update.

## Advanced calls with `tevmContract` and `tevmDeploy`

:::Danger[Not verified]
The tevm quick start guide thus far has only been verified up to the `Mining blocks` step.
Any further steps may have bugs and typos. A full documentationr revamp is underway and should be completed by end of May.
:::

All `call-like` endpoints for tevm use tevmCall under the hood including `eth_call`, `debug_traceCall`, `eth_sendRawTransaction`, and some special tevm methods like `tevmContract`, `tevmDeploy` and `tevmScript`. We will talk about `tevmScript` later.

Note we could use `tevmCall` and the `encodeDeployData` utility provided by viem but using `tevmDeploy` is a lot more ergonomic. `tevmDeploy` has access to all the special cheat properties (TODO link to BaseCallParams docs) that a normal `tevmCall` has

We also could use `tevmSetAccount` and manually set the `deployedBytecode` and any contract storage we want to set. This is a fine way to do it as well and often the most convenient if you don't need to execute the constructor code. We will use tevmDeploy here.

1. Let's use `tevmDeploy` to deploy a contract.

TODO we need to add simpleContract to `tevm/contracts` still! If you are following along this tutorial you can get it in meantime by installing `@tevm/test-utils` and importing it from there.

```typescript
// tevm/contracts has utils for creating `contracts` and `scripts` which we will cover later as well as a small library of commonly used contracts
import { simpleContract } from "tevm/contracts";

const initialValue = 420n;
const deployResult = await memoryClient.deploy({
  from: prefundedAccounts[0],
  abi: simpleContract.abi,
  // make sure to use bytecode rather than deployedBytecode since we are deploying
  bytecode: simpleContract.bytecode,
  args: [initialValue],
});
if (deployResult.errors) throw new AggregateError(deployResult.errors);
// remember to mine!
await memoryClient.mine();
```

The biggest gotchya to be aware of here is if you specify an abi without using `as const` or import it from a json it will hurt abitype's ability to infer typescript types which will lose you typesafety and editor autocompletion.

2. Now let's use `tevmContract` to call our contract

`tevmContract` is has a similar api to [readContract](https://viem.sh/docs/contract/readContract.html) from viem and has the followign advantages over a normal `tevmCall`.

TODO add links to all these

- will automatically encode the call data without needing to manually use `encodeFunctionData`
- will automatically decode the return data without needing to manually use `decodeFunctionResult`
- will automatically decode any revert messages without needing to manually use `decodeErrorResult`
- will throw useful warnings such as no contract bytecode existing at the contract address

Let's use tevm.contract to both read and write to the contract we just deployed. Feel free to add the results of these calls to the dom we will just console log them for now in this tutorial.

The contract has two methods. `get` to get the stored value and `set` to set the stored value.

```typescript
const contractResult = await memoryClient.contract({
  abi: simpleContract.abi,
  from: prefundedAccounts[0],
  functionName: "get",
});
if (contractResult.errors) throw new AggregateError(contractResult.errors);
console.log(contractResult.rawData); // returns the raw data returned by evm
console.log(contractResult.data); // returns the decoded data. Should be the initial value we set
console.log(contractResult.executionGasUsed); // returns the execution gas used (won't include the data cost or base fee)
// console log the entire result to become familiar with what all gets returned
console.log(contractResult);

// just like tevmCall we can write with `createTransaction: true`
const writeResult = await memoryClient.contract({
  createTransaction: true,
  abi: simpleContract.abi,
  from: prefundedAccounts[0],
  functionName: "get",
  args: [10_000n],
});

// remember to mine
await tevm.mine();

// now if we read again we should see
```

## Quick note on mining

Remember it's possible for a call to revert when it gets mined. We can check for this via checking the receipt using `memoryClient.getReceipt` (Note; getReceipt currently has a regression that should be fixed soon. If not fixed yet you can isntead use `memoryClient._tevm.getReceiptsManager()` as a temporary workaround for getting receipts

## Compiling contracts with the Tevm bundler

Tevm not only supplies a runtime EVM but also a buildtime tool for building your contracts within your JavaScript projects. It will compile your contracts for you via simply importing a solidity file.

In future versions `whatsabi` integration will also be added to be able to pull contracts that are deployed to live networks.

This bundler will give you a lot of great features such as

- natspec on hover
- go-to-definition taking you directly to the solidity contract definitions
- automatically recompiling when you change the contract code
- support for most bundlers including webpack, vite, esbuild, rollup, and bun
- typesafe feedback whenever you change your contract code

Tevm supports all major bundlers including vite, rollup, webpack, rspack, bun and esbuild. If your bundler is not supported open an issue it's likely a light lift to add support.

1. Install `@tevm/bundler`

```bash
npm i --save-dev @tevm/bundler
```

2. Configure vite

Configuring vite will allow vite to recognize solidity imports. When it sees solidity it will compile it into the abi and bytecode to make a `tevm contract` just like we made manually in `counterContract.ts`

Add the `viteExtensionTevm` to your vite config

```bash
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { vitePluginTevm } from '@tevm/bundler/vite'

// https://vitejs.dev/config/
export default defineConfig({
	define: {
		global: 'globalThis',
	},
	plugins: [
	    vitePluginTevm(),
		nodePolyfills({
			include: ['stream'],
			globals: {
				process: true,
				Buffer: true,
				global: true,
			},
		}),
	],
})

```

3. Add a simple contract

Now that vite can compile solidity we can add a contract.

Note: we must name our contract with a `.s.sol` extension rather than `.sol`. Compiling bytecode is expensive and usually unnecessary for contracts that are already deployed thus the compiler will only do it for files marked with `.s.sol`

If your contract doesn't have an .s.sol extension you can simply reexport it from a .s.sol file and target that file.

```bash
mkdir contracts && touch contracts/Counter.s.sol
```

Then add the contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Counter {
    uint256 public count;

    constructor() {
        count = 0;
    }

    function increment() public {
        count += 1;
    }
}
```

4. Import the contract and console.log it

```typescript
import { Counter } from "../contracts/Counter.s.sol";
console.log(Counter);
```

What is happening is vite is compiling your contract into it's bytecode and abi and returning a tevm `Script` object. With this script object we can really easily generate arguments to pass to `viem.readContract` or `tevm.contract`

```typescript
// example
const { data: count } = await memoryClient.tevmContract(
  Counter.withAddress(counterAddress).read.count(),
);
```

5. Configure the LSP

You may notice that typescript started giving you red underlines even though the application works. This is because though vite is able to compile contracts we haven't told typescript to do the same.

Add the `tevm/bundler/ts-plugin` to the typescript config (note I think you might have to install @tevm/ts-plugin because a bug here but will be testing later)

```json
{
  "compilerOptions": {
    "plugins": [
       {name: '@tevm/bundler/ts-plugin'}
    ]
    "target": "ES2021",
    ...
}
```

Now restart your editor/lsp and typescript will now be able to recognize your contract imports.

Note: If using vscode you will need to [set the workspace version](https://code.visualstudio.com/docs/typescript/typescript-compiling#_using-the-workspace-version-of-typescript) to load ts-plugins

Note: I haven't tested the LSP in many months while focusing on building MemoryClient so it may have regressions. We will be giving the bundler and lsp some more love by end of may.

6. Play with your contract

At this point we have covered all the major functionality of tevm and will be diving into more advanced features. Consider trying the following if you are up to it:

1. Deploy the contract using `tevm.setAccount` this time to any address you prefer
2. Use `tevm.setAccount` or the viem method `tevm.setStorageAt` to modify the storage of your contract without needing to create a transaction
3. Try out the `tevmDumpStorage` action. Together with `loadStorage` this method can be used to hydrate and persist the tevm evm state.

4. Best practices

Importing solidity directly is a convenience for when you are developing scripts and contracts within the same codebase as your javascript. It is NOT recomended to copy paste contracts just to use them with the tevm bundler. Instead consider the following options if the contract isn't in your code base:

1. In future versions whatsabi integration will allow you to generate the contracts via pointing at a block explorer
2. If contract is on npm or github you can npm install the package and then import it from node_modules. The tevm compiler supports node_resolution to import from other monorepo packages and node_modules
3. Use `createScript` or `.s.sol` files anytime you need the bytecode even if not being used as a script (such as if you want to deploy the contract using tevmDeploy)
4. Finally the most manual way of creating a contract is to use human readable abi for any contract methods you need using `createScript` or `createContract` <- TODO link to reference docs. You only need to include the methods you wish to use

```typescript
import { createContract } from "tevm/contracts";

const myContract = createContract({
  name: "MyErc721",
  humanReadableAbi: ["function balanceOf(address): uint256"],
});
```

# Advanced feature: Scripting

## Basic scripting

Like foundry, Tevm offers an extremely powerful solidity scripting environment. Tevms scripts are very tightly integrated into typescript and also include the ability to execute arbitrary typescript within them.

Any solidity contract can be ran as a script. For example, let's run our counter script. Since we already experimented with browser let's try using it in `vitest`

1. Install vitest

`npm install vitest --save-dev`

Vitest will work with the same tevm plugin we already installed.

2. Import your script and execute it

```typescript
import { Counter } from "../contract/Counter.s.sol";
import { test, expect } from "vitest";

test("scripting", () => {
  // let's just throw on fail since we are just playing with scripts not building a production app
  const memoryClient = createMemoryClient();

  const scriptResult = memoryClient.tevmScript(Counter.read.count());
});
```

Notice we never had to deploy our script. Tevm scripts will deploy the script for you and then execute them. Tevm scripts will not execute the constructor though as they use `tevmSetAccount` not `tevmDeploy` to deploy the contract.

## Precompiles

Tevm does not have an enumerated set of cheat codes like foundry but instead just offers a way of executing arbitrary javascript within your scripts. This allows you to do wild stuff theoretically like

- Read and write to the file system within solidity contract
- Read and write to the dom within solidity contracts
- One could implement `foundry compatability` such that they actually could use foundry cheat codes even in tevm. Foundry scripts in browsers!
- I'm sure there are even more creative use cases that you can think of

Precompiles require 3 steps to create.

1. Create an interface in solidity
2. Implement the interface in TypeScript
3. Initialize MemoryClient with the precompiles
4. Either pass in precompiles as arguments to your scripts (my preference), or use their hardcoded addresses.

Let's do create a precompile to read and write to the file system.

1. Create a solidity interface in `Fs.sol`

The solidity interface will be used when calling precompiles within solidity and also used to make the JavaScript implementation typesafe.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

interface Fs {
    /**
     * @notice Reads the content of a file at the specified path.
     * @param path The path of the file to read.
     * @return data The content of the file.
     */
    function readFile(string calldata path)
        external
        view
        returns (string memory data);

    /**
     * @notice Writes data to a file at the specified path.
     * @param path The path of the file to write to.
     * @param data The data to write to the file.
     */
    function writeFile(string calldata path, string calldata data)
        external
        returns (bool success);
}

```

2. Implement your precompile using `createPrecompile`

By importing our precompile interface and passing it to `createPrecompile` typescript will make sure we are implementing every method and returning the correct data type.

The return value of a precompile contains both a value but it also can return logs and gasUsed. We will simply return a value and charge 0 gas.

```typescript
import fs from "node:fs/promises";
import { defineCall, definePrecompile } from "../src/index.js";
import { Fs } from "./Fs.sol";

const contract = Fs.withAddress("0xf2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2");

export const fsPrecompile = definePrecompile({
  contract,
  call: defineCall(Fs.abi, {
    readFile: async ({ args }) => {
      return {
        returnValue: await fs.readFile(...args, "utf8"),
        executionGasUsed: 0n,
      };
    },
    writeFile: async ({ args }) => {
      await fs.writeFile(...args);
      return { returnValue: true, executionGasUsed: 0n };
    },
  }),
});
```

3. Now call precompiles from your scripts

My preference is to dependency inject the precompile as an argument

```typescript
// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

import {Fs} from "./Fs.sol";

contract WriteHelloWorld {
    function write(Fs fs) public {
        fs.writeFile("test.txt", "Hello world");
    }
}
```

4. Pass precompile to `createMemoryClient`

```typescript
import { expect, test } from "bun:test";
import { createMemoryClient } from "@tevm/memory-client";

import { existsSync, rmSync } from "node:fs";
import { fsPrecompile } from "./FsPrecompile.js";

import { WriteHelloWorld } from "./WriteHelloWorld.s.sol";

test("Call precompile from solidity script", async () => {
  const client = createMemoryClient({
    customPrecompiles: [fsPrecompile.precompile()],
    loggingLevel: "trace",
  });

  const result = await client.tevmScript({
    ...WriteHelloWorld.write.write(fsPrecompile.contract.address),
    throwOnFail: false,
  });

  expect(existsSync("test.txt")).toBe(true);

  rmSync("test.txt");
});
```

## What else can tevm do?

We have now implemented all major features of Tevm into a simple application running the EVM. The use cases from here are vast.

There are more features to explore such as

- diving deeper into the viem actions api
- the low level apis are open to use such as `getTxPool()`, `getReceiptsManager()`, and `getVm()`
- After calling `getVm()` you can explore the vm methods such as `vm.buildBlock`, stateManager methods such as `vm.stateManager.foo`, blockchain methods `vm.blockchain.setStateRoot`, and evm methods like `vm.evm.runCall`. This low level api uses the [`ethereumjs api`](https://github.com/ethereumjs)
- You can run a tevm memory client as a server and issue json-rpc requests to it. This can be powerful testing alternative to using anvil.

```typescript
import { createServer } from "@tevm/server";
import { createMemoryClient } from "tevm";

const memoryClient = createMemoryClient();

const server = createServer({
  request: tevm.request,
});

server.listen(8080, () => console.log("listening on 8080"));
```

If you create a server you can talk to it with a normal viem client. If you wish to add the custom tevm actions to a viem client using it's decorators

```typescript
import {tevmActions} from '@tevm/actions'
import {createPublicClient, http} from 'viem'

const client = createPublicClient({transport: 'https://localhost:8080'}).extend(tevmActions())

client.tevmContract(...)
```

- If you prefer ethers the `@tevm/ethers` package provides an ethers provider that uses tevm as it's in memory backend similar to MemoryClient.
- Tevm supports advanced tracing apis. Try passing `createTrace` to a tevmCall or tevmContract. In near future we will also support `createAccessList`

Finally if you enjoy tevm consider staring the github and joining the telegram!
