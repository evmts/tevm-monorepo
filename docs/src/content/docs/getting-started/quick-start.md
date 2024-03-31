---
title: Quick start guide
description: Tevm introduction
---

# Vanilla Tevm Quick Start Guide

## Introduction

We will be creating a simple counter app using TypeScript and html.

This guide will get you familiar with the most essential features of Tevm and start interacting with the Ethereum Virtual Machine (EVM) in Node.js or browser environments. By the end of this guide you will understand:

:::tip
Looking for a more specific guide? Try the alternative quick start guides:

- [Next.js](todo.todo)
- [Bun](todo.todo)
- [Vitest](todo.todo)
:::
1. How to create a forked EVM in JavaScript using [`createMemoryClient`](/reference/tevm/memory-client/functions/creatememoryclient)
2. How to write, build, and execute solidity scripts with a [`TevmClient`](/reference/tevm/client-types/type-aliases/tevmclient)
3. How to streamline your workflow using [`tevm contract imports`](/reference/tevm/bun-plugin/functions/bunplugintevm) with the tevm bundler
4. How to write solidity scripts with the [`tevm script action`](/reference/tevm/client-types/type-aliases/tevmclient#script)

We will be creating a project from scratch.

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

`npm init` will scaffold a new project. Omit `--yes` if you want to customize the package.json if you want to customize the package.json.

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

We are going to be using a minimal vanilla setup with no framework. There are guides for specific frameworks including [Next.js](todo.todo).0

1. Create a tsconfig

The following config works quite nicely with vite apps.

See the [tsconfig docs](https://www.typescriptlang.org/tsconfig) for more information about these options.

```bash
echo '{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
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
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>

</html>
'
```

You will see it is importing a `src/main.tsx` file in a script tag. Go ahead and add that too

```bash
echo '
const app = document.querySelector('#app')
app.innerHtml = "<div>Hello Tevm</div.";
'
```

Now double check that you can run your application

```bash
npx vitest ./index.html
```

Hit `o` key on keyboard to open up [`http://localhost:5173`](http://localhost:5173) in your browser

You should see `Hello Tevm` rendered

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
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
	define: {
		global: 'globalThis',
	},
	plugins: [
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
' > vite.config.js
```

## Creating a Tevm VM

Now let's create a Tevm VM client. This client will serve as the backend RPC transport provider for viem rather than a normal [http](https://viem.sh/docs/clients/transports/http.html)

1. In the `index.ts` file initialize a [MemoryClient](/reference/tevm/memory-client/type-aliases/memoryclient) with [createMemoryClient](/reference/tevm/memory-client/functions/creatememoryclient)

The `memoryClient` is an in memory instance of the ethereum VM that will be running in the browser. Similar to `anvil` it can fork an existing network. Let's fork [`optimism`](https://docs.optimism.io) and render the blockNumber.

```typescript
import { createMemoryClient, hexToNumber } from 'tevm';

const app = document.querySelector('#app')
app.innerHtml = `<div id="blocknumber"></div>`;

const memoryClient = createMemoryClient({
  fork: {
    url: 'https://mainnet.optimism.io'
  },
});

memoryClient.request({
  method: 'eth_blockNumber'
}).then(bn => {
  document.querySelector('#blocknumber').innerText = `${hexToNumber(bn)}`
})
```

You will see the block number appear on the page. Feel free to experiment with interacting with the tevm client more. It supports the following methods

- [much of the ethereum json-rpc api](/reference/tevm/procedures-types/type-aliases/tevmjsonrpcrequesthandler) such as `eth_call` and `eth_sendRawTransaction`
- [anvil_, hardhat_, and ganache_](https://hardhat.org/hardhat-network/docs/reference#hardhat-network-methods) methods
- Special `tevm_` apis such as `tevm_getAccount` which can retrieve account information such as bytecode, balance, and storage.

## Connecting the Tevm VM to viem

Tevm can be used standalone as we did but for the best experience and maximum compatability with other tools it is recomended most people use Tevm along with [viem](https://viem.sh). 

Viem transports are how viem communicates with [ethereum using jsonrpc](https://ethereum.org/en/developers/docs/apis/json-rpc/). With Tevm viem can communicate with an in-memory instance of Tevm via a `TevmTransport`.

1. Initialize a [Client](https://viem.sh/docs/clients/intro) 

We are going to decorate our client with the following actions.

- [viem publicActions](https://viem.sh/docs/actions/public/introduction) - action that maps one-to-one with a "public" Ethereum RPC method (eth_blockNumber, eth_getBalance, etc)
- [viem testActions](https://viem.sh/docs/actions/test/introduction) - actions that map one-to-one with "test" Ethereum RPC methods (evm_mine, anvil_setBalance, anvil_impersonate, etc)
- [custom tevm actions](https://todo.todo.todo) - powerful custom actions build specifically for tevm.

Let's create a new file for our client.

```bash
touch src/client.ts
```

And now initialize a new client with all our actions. We will make a Tevm client just like before and pass it into `createTevmTransport`

We won't bother forking any network this time .

```typescript
import {createClient, publicActions, testActions} from 'viem'
import {createMemoryClient, createTevmTransport, tevmActions } from 'tevm'

const memoryClient = createMemoryClient()

export const client = createClient({
  transport: createTevmTransport(memoryClient)
})
  .extend(publicActions())
  .extend(testActions({mode: 'anvil'}))
  .extend(tevmActions())
```

2. Refactor our `main.js` code to use our viem client rather than tevm client directly

Using viem provides a much smoother dev experience than using tevm client directly

```typescript
import { client } from './client';

const app = document.querySelector('#app')
app.innerHtml = `<div id="blocknumber"></div>`;

client.getBlockNumber.then(bn => {
  document.querySelector('#blocknumber').innerText = `${bn}`
})
```

Since we didn't fork a live network we should see a block number of 0 now

## Creating Tevm contracts

Next we will use `createContract` to create a `tevm` contract instance.

A tevm contract is optional but highly recomended api to use. A tevm contract instance provides a typesafe api for interacting with viem and tevm actions.

Create a new file called `counterContract.ts`

```bash
touch src/counterContract.ts
```

Then initialize our counter contract. We will enter the bytecode and abi ourselves here but later we will refactor this to instead compile a solidity contract to get the bytecode and abi.

We are initializing our contract as a script. Don't worry too much about the difference between a script and a contract yet but at a high level a script is a contract that isn't already deployed to the chain.

```typescript [counterContract.ts]
import {createScript} from 'tevm'

const address = `0x${'1234'.repeat(10)}`

export const counterContract = createScript({
  deployedBytecode: '0xtodo',
  humanReadableAbi: [
    'function increment() external'
    'function count() external view returns (uint256)'
  ],
}).withAddress(address)
```

## Deploying our contract 

Because tevm has anvil and hardhat compatability, we can deploy our contract via [setCode](https://viem.sh/docs/actions/test/setCode) from viem. 

Add the following code to the top of your `main.js` file

```typescript
import { client } from './client';
import {counterContract} from './counterContract'

const app = document.querySelector('#app')
app.innerHtml = `<div id="blocknumber"></div>`;

client.getBlockNumber.then(bn => {
  document.querySelector('#blocknumber').innerText = `${bn}`
})

client.setCode({
  address: counterContract.address,
  bytecode: counterContract.deployedBytecode
})
```

## Interacting with our contract

One can interact with contracts via normal viem methods like [readContract](https://viem.sh/docs/contract/readContract#readcontract) or [sendRawTransaction](https://viem.sh/docs/actions/wallet/sendRawTransaction) but the best way to interact with tevm contracts is via the custom `tevm.call` family of methods. This includes the following

- `client.tevm.call` - execute a low level call vs the evm
- `client.tevm.contract` - execute a call vs the evm with an api that takes `abi`, `functionName` and `args` similar to `readContract`
- `client.tevm.script` - executes arbitrary bytecode vs the evm

1. Use `client.tevm.contract` to read a contract

Since our contract is deployed to tevm via `setCode` already we will use `client.tevm.contract`

Read the contract count and add display it. Let's also put all our code into a `main` function.

```typescript
import { client } from './client';
import {counterContract} from './counterContract'

const appEl = document.querySelector('#app')
app.innerHtml = `<div id="blocknumber"></div>
<div id="count"></div>
`;
const blockNumberEl = appEl.querySelector('#blocknumber')
const countEl = appEl.querySelector('#count')

async function main() {
  client.getBlockNumber.then(bn => {
    blockNumberEl.innerText = `${bn}`
  })

  // wait for contract to be deployed
  await client.setCode({
    address: counterContract.address,
    bytecode: counterContract.deployedBytecode
  })

  const count = await client.tevm.contract({
    // can set from address to any account
    // You can alternatively individually set `origin` and `caller` 
    from: `0x${'01'.repeat(20)}`,
    to: counterContract.address,
    // the api for tevm.contract is similar to viem
    abi: counterContract.abi,
    functionName: 'count',
    // advanced options such as skipBalanceCheck are available
    // skipBalanceCheck will automatically mint the value if the account doesn't have it
    value: 420n,
    skipBalanceCheck: true,
  })

  countEl.innerText = count.toString()
}
```

2. Use `client.tevm.contract` with `createTransaction: true` to modify the blockchain state.

We will move our count rendering logic to an `updateCount` function and add a button to update the count.

This initial example will intentionally have a bug in it.

```typescript
import { client } from './client';
import {counterContract} from './counterContract'

const app = document.querySelector('#app')
app.innerHtml = `<div id="blocknumber"></div>
<div id="count"></div>
<button id="increment>Increment</div>"
`;
const blockNumberDiv = app.querySelector('#blocknumber')
const countDiv = app.querySelector('#count')
const incrementButton = app.querySelector('#increment')

main()

async function main() {
  client.getBlockNumber.then(bn => {
    blockNumberEl.innerText = `${bn}`
  })

  // wait for contract to be deployed
  await client.setCode({
    address: counterContract.address,
    bytecode: counterContract.deployedBytecode
  })

  await updateCount()

  incrementButton.onClick(increment)
}

async function updateCount() {
  const count = await client.tevm.contract({
    // can set from address to any account
    // You can alternatively individually set `origin` and `caller` 
    from: `0x${'01'.repeat(20)}`,
    to: counterContract.address,
    // the api for tevm.contract is similar to viem
    abi: counterContract.abi,
    functionName: 'count',
    // advanced options such as skipBalanceCheck are available
    // skipBalanceCheck will automatically mint the value if the account doesn't have it
    value: 420n,
    skipBalanceCheck: true,
  })
  countEl.innerText = count.toString()
}

async function increment() {
  await client.tevm.contract({
    // by default `calls` are readonly
    // set createTransaction to true to actually submit a tx
    createTransaction: true,
    from: `0x${'01'.repeat(20)}`,
    to: counterContract.address,
    abi: counterContract.abi,
    functionName: 'increment',
  })
  await updateCount()
}
```

We will notice the increment does actually increase the counter. This is because the transaction is `pending` and not actually mined yet.

There are 3 ways to fix this.

#### Fix 1 - Explicitly call `client.mine()`

The simplist fix is to just mine a new block before calling updateCount

```typescript
await client.tevm.contract({
    // by default `calls` are readonly
    // set createTransaction to true to actually submit a tx
    createTransaction: true,
    from: `0x${'01'.repeat(20)}`,
    to: counterContract.address,
    abi: counterContract.abi,
    functionName: 'increment',
})
await client.mine({blocks: 1})
await updateCount()
```

#### Fix 2 - Read from `pending` block tag

Tevm and other ethereum clients has a special block tag `pending` which predicts what the next block will look like based on the current pending transaction pool (mempool). We could update our count read to use this block tag.

```typescript
const count = await client.tevm.contract({
    from: `0x${'01'.repeat(20)}`,
    to: counterContract.address,
    abi: counterContract.abi,
    functionName: 'count',
    value: 420n,
    skipBalanceCheck: true,
    # Add a block tag of `pending` to read state including unmined tx
    blockTag: 'pending,'
})
countEl.innerText = count.toString()
```

#### Fix 3 - Set a different mining mode

By default the mining mode is `manual` meaning tevm will not mine a new block unless explicitly told to do so. We can set it to `auto` and then it will mine a block everytime it receives a tx.

Let's just update `client.ts` to automine so we don't need to remember to mine any blocks.

```typescript
const memoryClient = createMemoryClient({
  miningConfig: {
   type: 'auto'
  }
})
```

## Compiling contracts with the Tevm bundler

Remember before we created our contract via hardcoding the abi and bytecode using `createContract`. Tevm supports an optional bundler which can generate these from you directly from contract imports.

This bundler will also give you a lot of other great features such as

- natspec on hover
- go-to-definition taking you directly to the solidity contract definitions
- automatically recompiling when you change the contract code 
- support for most bundlers including webpack, vite, esbuild, rollup, and bun

To use the bundler we must first install `@tevm/bundler` and configure vite and typescript.

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

3. Refactor counterContract.ts to import our solidity implementation

Now that vite can compile solidity we can add our contract.

Note: we must name our contract with a `.s.sol` extension rather than `.sol`. Compiling bytecode is expensive and usually unnecessary for contracts that are already deployed thus the compiler will only do it for files marked with `.s.sol`

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

4. Replace the old import with an import to the contract

With the tevm compiler you simple just import solidity file and your bundler (in this case vite) will take care ofyour bundler (in this case vite) will take care of the rest.

We will compile the bytecode in `counterContract.ts` and continue to add our address to it.

```typescript
import {Counter} from '../contracts/Counter.sol'

const address = `0x${'1234'.repeat(10)}`

export counterContract = Counter.withAddress(address)
```

Now restart your vite app and you should see no differences from before.

5. Configure the LSP

You may notice that typescript started giving you red underlines even though the application works. This is because though vite is able to compile contracts we haven't told typescript to do the same.

Add the `@tevm/bundler/ts-plugin` to the typescript config

```json
{
  "compilerOptions": {
    "plugins": [
       {name: '@tevm/bundler/ts-plugin'}
    ]
    "target": "ES2020",
    ...
}
```

Now restart your editor/lsp and typescript will now be able to recognize your contract imports.

Note: If using vscode you will need to [set the workspace version](https://code.visualstudio.com/docs/typescript/typescript-compiling#_using-the-workspace-version-of-typescript) to load ts-plugins

## Summary

We have now implemented all major features of Tevm into a simple application running the EVM. The use cases from here are vast

- You can execute transactions locally in the browser to implement optimistic updates
- You can reuse solidity code rather than reimplementing logic in JavaScript
- You can use `tevm scripts` to add custom view functions to contracts
- You can now do difficult tasks such as estimating gas after modifying the state
- You can use tevm as a more javascript native alternative to anvil ganache or hardhat for your tests
- You can use tevm as a playground to experiment with solidity contracts
- You can take advantage of powerful tevm precompiles to write a server in solidity with the full power of node.js behind it.

