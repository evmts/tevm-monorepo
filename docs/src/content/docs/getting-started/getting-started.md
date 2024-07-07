---
title: Getting started guide
description: Tevm introduction
---

# Tevm Getting Started Guide

## Introduction

We will be creating a simple counter app using the following technologies:

- Tevm + [Viem](https://viem.sh)
- [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) + [TypeScript](https://www.typescriptlang.org/) to build an ui with no framework
- [Vite](https://vitejs.dev/) + Tevm Bundler as a minimal build setup and dev server

This guide intentionally uses a straightforward setup to focus on the most essential features of Tevm, so every piece is understood.

## Prerequisites

- [Node.js >18.0](https://nodejs.org/en)
- Basic knowledge of [JavaScript](https://www.youtube.com/watch?v=g7T23Xzys-A)
- Basic knowledge of [solidity](https://docs.soliditylang.org/en/v0.8.25/)
- Familiarity with [viem](https://viem.sh) or a similar library like [ethers.js](https://docs.ethers.org/v6/)

## Creating your Tevm project

### 1. Create a new project directory:

```bash
mkdir tevm-app && cd tevm-app
```

### 2. Initialize your project

```bash
npm init --yes
```

### 3. Install `tevm` and `viem` as runtime dependencies

```bash
npm install tevm viem
```

### 4. Install `vite` and `typescript` as buildtime dependency

Vite will provide us a pretty minimal setup to import TypeScript into our HTML and start a dev server

```bash
npm install --save-dev vite typescript
```

## Scaffold the initial project

### 1. Create a tsconfig

The following config works quite nicely with vite apps.

Feel free to use any tsconfig you prefer as long as it

- uses strict mode
- supports bigint (ES2020 or later)

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

### 2. Create an HTML file

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

### 3. Add a typescript file

You will see the HTML file is importing a `src/main.ts` file in a script tag. Go ahead and add that too

```bash
mkdir src && echo '
const app = document.querySelector("#app") as Element;
app.innerHTML = `<div>Hello Tevm</div>`;
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

### 4. Add polyfills

To use Tevm and viem in the browser it is necessary to add some [polyfills](https://developer.mozilla.org/en-US/docs/Glossary/Polyfill). These will inject code into your final build that will allow apis that do not exist in the browser natively to work.

Install [a polyfill library](https://github.com/davidmyersdev/vite-plugin-node-polyfills) to polyfill `node`

```bash
npm i --save-dev vite-plugin-node-polyfills
```

Then create a basic [vite config](https://vitejs.dev/config/). This will build our app with ['stream'](https://nodejs.org/api/stream.html), ['process'](https://nodejs.org/api/process.html), ['Buffer'](https://nodejs.org/api/buffer.html), and ['global'](https://nodejs.org/api/globals.html) polyfills

If you are using Tevm in node.js or bun no polyfills are necessary. Over time tevm has been and will continue to remove the need for polyfills.

```bash
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

Restart your vite server and now vite has everything it needs to run an Ethereum devnet in the browser.

## Create MemoryClient

Now let's create a MemoryClient. A memory client is a [viem client](https://viem.sh/docs/clients/intro.html) using an in-memory [transport](https://viem.sh/docs/clients/intro#transports). This means instead of sending requests to an RPC provider like alchemy it will be processing requests with tevm in memory in a local EVM instance running in JavaScript.

Memory client is similar to `anvil`. It can:

- Optionally fork an existing network
- Run special scripts that have advanced functionality
- Extremely hackable. Can mint yourself eth, run traces, modify storage, and more

:::tip[Use tree shakable actions]
This guide uses MemoryClient. A batteries included client. This client helps make exploring tevm for the first time easier.
If you are building a UI with tevm, it is highly recomended you use `createClient` from viem along with `createTevmTransport` and tree shakable actions.
See [client guide](https://tevm.sh/learn/clients/) for more info
:::

### 1. In the `src/main.ts` file initialize a [MemoryClient](/reference/tevm/memory-client/type-aliases/memoryclient) with [createMemoryClient](/reference/tevm/memory-client/functions/creatememoryclient)

```typescript
import { createMemoryClient, http } from "tevm";
import { optimism } from "tevm/common";

const app = document.querySelector("#app") as Element;

const memoryClient = createMemoryClient({
  common: optimism,
  fork: {
    // @warning we may face throttling using the public endpoint
    // In production apps consider using `loadBalance` and `rateLimit` transports
    transport: http("https://mainnet.optimism.io")({}),
  },
});

async function runApp() {
  app.innerHTML = `<div id="status">initializing...</div>
<div id="blocknumber"></div>
`;
  const status = app.querySelector("#status")!;

  document.querySelector("#blocknumber")!.innerHTML =
    `Fetching block number next step. For now let's check out which methods are on memory client:
<ul>
  ${Object.keys(memoryClient).map((key) => `<li>${key}</li>`)}
</ul>`;

  status.innerHTML = "Done";
}

runApp();
```

When we fork a network the blocknumber will be pinned to the block number at the time of the fork. As you mine new blocks you will not get updates from the chain unless you refork it.

It is recomended you also pass in a `chain` object when forking. This will improve the performance of forking as well as guarantee tevm has all the correct chain information such as which EIPs and hardforks to use. A TevmChain is different from a viem chain in that it extends viem chains with the `ethereumjs/common` interface.

One can use a [viem wallet client](https://viem.sh/docs/clients/wallet.html) or [add the wallet actions to the client](k)

:::caution[Tevm performance]
Performance is a known issue. Tevm is pretty slow especially when the fork url is slow. Currently tevm development is focused on feature completeness and correctness. Performance improvements will be prioritized after stable 1.0.0 release.

Consider using an authenticated RPC url to help speed up performance.
:::

## Viem client API

The core apis for tevm are the [public viem actions api](https://viem.sh/docs/actions/public/introduction). All public actions are supported.

Let's use [getBlockNumber](https://viem.sh/docs/actions/public/getBlockNumber.html) action from viem to populate the blocknumber div.

```typescript
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
```

:::tip[Wallet and test actions]
[Wallet](https://viem.sh/docs/actions/wallet/introduction) and [test](https://viem.sh/docs/actions/test/introduction) actions can also be used with tevm. For more information see [the tevm actions guide](../learn/actions/index.md)
:::

## Tevm account actions

In addition to the viem api there are also powerful [tevm specific actions](https://tevm.sh/reference/tevm/decorators/type-aliases/tevmactionsapi/). Let's start with the account actions [`tevmSetAccount`](/reference/tevm/actions-types/type-aliases/setaccounthandler/) and [`tevmGetAccount`](/reference/tevm/actions-types/type-aliases/getaccounthandler/)

:::tip[JSON-RPC]
All Tevm actions are available as [JSON-RPC endpoints](/learn/json-rpc/) and can be called with the EIP-1193 compatable `tevm.request` function. This allows tevm to be composed with any other library that supports EIP-1193 as well as providing an API to use tevm over HTTP

Tevm also supports much of the [ethereum jsonrpc](https://ethereum.org/en/developers/docs/apis/json-rpc/) and [anvil/hardhat methods](https://hardhat.org/hardhat-network/docs/reference#hardhat-network-methods)
:::

### 1. Add a div to add some of our account information

```typescript
app.innerHTML = `<div id="status">initializing...</div>
<div id="blocknumber"></div>
<div>
  Address: <span id="address"></span>
</div>
<div>
  Nonce: <span id="nonce"></span>
</div>
<div>
  Balance: <span id="balance"></span>
</div>
`;
```

### 2. Add function that displays account balance

After adding you should see it throw an [`AccountNotFoundError`](https://tevm.sh/reference/tevm/errors/type-aliases/accountnotfounderror/#_top) in the chrome console.

```typescript
// addresses and abis must be as const for tevm types
const address = `0x${"0420".repeat(10)}` as const;
async function updateAccounts() {
  // we are setting throwOnFail to false because we expect this to throw an error from the account not existing
  const account = await memoryClient.tevmGetAccount({
    address,
    throwOnFail: false,
  });
  if (account.errors) {
    // this will error
    console.error("Unable to get account", account.errors);
    return;
  }
  console.log(account); // console log the account to get familiar with what properties are on it
  document.querySelector("#address")!.innerHTML = address;
  document.querySelector("#nonce")!.innerHTML = String(account.nonce);
  document.querySelector("#balance")!.innerHTML = String(account.balance);
}

function runApp() {
  ...
  status.innerHTML = 'Updating accounts...'
  await updateAccounts()

  status.innerHTML = "Done";
}
```

- [`tevmGetAccount`](/reference/tevm/actions-types/type-aliases/getaccounthandler/) will throw if the account is uninitialized (e.g. it has never been touched by the EVM)
- Tevm has ability to both return errors as typed values as well as throw them using `throwOnFail` prop. It is recomend to return as values and always handle them for production applications.
- Tevm errors are strongly typed though at this moment not every error is accounted for. They come with a strongly typed `name` property as well as a helpful error message.

:::tip[Contract storage]
By default `tevmGetAccount` will not return contract storage. To get contract storage you must set the [`returnStorage`](https://tevm.sh/reference/tevm/actions-types/type-aliases/getaccountparams/#returnstorage) option to true
:::

### 3. Use `tevmSetAccount` to initialize the account

Use `tevmSetAccount` to initialize the account with some eth and fix the "Account not found" error

```typescript
async function runApp() {
  ...

  status.innerHTML = "Setting account...";
  const setAccountResult = await memoryClient.tevmSetAccount({
    address,
    balance: 420n,
    throwOnFail: false,
  });
  if (setAccountResult.errors) console.error(setAccountResult.errors);

  status.innerHTML = "Updating account...";
  await updateAccounts();

  status.innerHTML = "done";
}
```

Now we should see the account balance of 420n and a nonce of 0n.

:::tip[Creating your own client]
In addition to memory client you can also create your own client using lower level primitives like `createTevmTransport` and `tevmActions`. This can be helpful if you prefer to not include actions you aren't going to use or want to add your own actions.

See [`createMemoryClient` source](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/createMemoryClient.js) as a reference of how to build a memory-client with lower level primitives.
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

Anytime you create a transaction it will default to the first prefunded account as the msg.sender unless overridden by an explicit `from`, `caller`, or `origin` prop.

## Executing the EVM with tevmCall

Tevm can execute the EVM using viem methods such as [`memoryClient.call`](https://viem.sh/docs/actions/public/call#call), [`memoryClient.readContract`](https://viem.sh/docs/contract/readContract#readcontract), [`memoryClient.estimateGas`](https://viem.sh/docs/actions/public/estimateGas#estimategas), etc. It also supports some wallet methods such as [`eth_sendRawTransaction`](https://viem.sh/docs/actions/wallet/sendRawTransaction#sendrawtransaction).

Tevm also has it's own powerful method for executing the evm called [`tevmCall`](https://tevm.sh/reference/tevm/actions-types/type-aliases/callhandler/#_top). It's like a normal ethereum call but with extra superpowers to do things such as

- [create a transaction](https://tevm.sh/reference/tevm/actions-types/type-aliases/basecallparams/#createtransaction)
- [impersonate](https://tevm.sh/reference/tevm/actions-types/type-aliases/basecallparams/#from) any account or contract
- arbitrarily [set the call depth](https://tevm.sh/reference/tevm/actions-types/type-aliases/basecallparams/#depth)
- [skip all balance checks](https://tevm.sh/reference/tevm/actions-types/type-aliases/basecallparams/#skipbalance)

It also happens to be the [shared code](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/tevm/callHandler.js) that supports executing all other call-like methods so it can do everything.

### Send eth using `tevmCall`

```typescript
import { prefundedAccounts } from "tevm";

...

async function runApp() {
	app.innerHTML = `<div id="status">initializing...</div>
<div id="blocknumber"></div>
<div>
  Address: <span id="address"></span>
</div>
<div>
  Nonce: <span id="nonce"></span>
</div>
<div>
  Balance: <span id="balance"></span>
</div>
`;

	const status = app.querySelector("#status")!;

	status.innerHTML = "Fetching block number...";

	const blockNumber = await memoryClient.getBlockNumber();
	document.querySelector("#blocknumber")!.innerHTML =
		`ForkBlock: ${blockNumber}`;

	status.innerHTML = "Setting account...";
	const callResult = await memoryClient.tevmCall({
    // this is the default `from` address so this line isn't actually necessary
    from: prefundedAccounts[0],
    to: address,
    value: 420n,
    throwOnFail: false,
  });
  // aggregate error is a good way to throw an array of errors
  if (callResult.errors) throw callResult.errors;

	status.innerHTML = "Updating account...";
	await updateAccounts();

	status.innerHTML = "done";
}
```

### Fix bug using `createTransaction`

After we run this code we should see an error in our console. The balance never updated even though there are no errors. This is because we just did a normal `call` which executes against the EVM but doesn't actually update any state. This is the default and best used for simply reading the evm. Let's fix this using [`createTransaction`](https://tevm.sh/reference/tevm/actions-types/type-aliases/basecallparams/#createtransaction).

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

Well we did successfully create a transaction which we can see by checking the [tx hash](https://tevm.sh/reference/tevm/actions-types/type-aliases/callresult/#txhash)

```typescript
console.log(callResult.txHash);
```

If we remove the createTransaction: true the txHash will not be there. However, the transaction has not been mined. It is currently in the mempool. Let's see it using a low level API [`getTxPool()`](https://tevm.sh/reference/tevm/base-client/type-aliases/baseclient/#gettxpool)

```typescript
// the tevm means this api is not guaranteed to remain stable
const mempool = await memoryClient.tevm.getTxPool();
console.log(await mempool.getBySenderAddress(EthjsAddress.fromString(prefundedAccounts[0])));
```

:::tip[Using the low level api]
The low level API on tevm such as `tevm.getTxPool()` is the same API used internally to implement all tevm actions. Tevm believes in remaining maximally hackable and nearly anything you can imagine is possible if you use the low level api.
The actions api is a more streamlined experience and much more stable to breaking changes however so use the low level api at your own risk.
:::

### Fix second bug using `tevmMine`

While `cheat` methods like `tevmSetAccount` will immediately update the state for the current block. `call` methods like `tevmCall` will not update the state until a new block is mined.

Currently tevm only supports [`manual` mining](https://tevm.sh/reference/tevm/base-client/type-aliases/baseclientoptions/#miningconfig) but in future versions it will support other modes including `automining`, `gasmining` and `intervalmining`. To mine a block simply call [`tevm.mine()`](https://tevm.sh/reference/tevm/actions-types/type-aliases/minehandler/). It will sort the mempool based on priority fees and nonces and mine all transactions up until the block gas limit.

First delete the mempool code and then replace it with a [memoryClient.tevmMine()](https://tevm.sh/reference/tevm/actions-types/type-aliases/minehandler/)

```typescript
status.innerHTML = "Sending eth to account...";

const callResult = await memoryClient.tevmCall({
  // this is the default `from` address so this line isn't actually necessary
  from: prefundedAccounts[0],
  to: address,
  value: 420n,
  createTransaction: true,
});
if (callResult.errors) throw callResult.errors;

status.innerHTML = "Mining block";

const mineResult = await memoryClient.tevmMine();
if (mineResult.errors) throw mineResult.errors;
console.log(mineResult.blockHashes);

status.innerHTML = "Updating account...";

await updateAccounts();

status.innerHTML = "done";
```

Now that we mined a block we should finally see our account balance update.

:::tip[Remember tx can revert]
Remember it's possible for a call to revert when it gets mined even if it didn't revert when the call was simulated. We can check for this via checking the receipt using `memoryClient.getTransactionReceipt`.
:::

## Deploy a contract with `tevmDeploy`

All `call-like` endpoints for tevm use tevmCall under the hood including [`eth_call`](https://tevm.sh/reference/tevm/actions-types/type-aliases/ethcallhandler/), [`debug_traceCall`](https://tevm.sh/reference/tevm/actions-types/type-aliases/debugtracetransactionhandler/), [`eth_sendRawTransaction`](https://tevm.sh/reference/tevm/procedures-types/type-aliases/ethsendrawtransactionjsonrpcprocedure/), and some special tevm methods like [`tevmContract`](https://tevm.sh/reference/tevm/actions-types/type-aliases/contracthandler/), and [`tevmDeploy`](https://tevm.sh/reference/tevm/actions-types/type-aliases/deployhandler/).

Note we could use [`tevmCall`](https://tevm.sh/reference/tevm/actions-types/type-aliases/callhandler/) and the [`encodeDeployData`](https://tevm.sh/reference/tevm/utils/functions/encodedeploydata/). Using `tevmDeploy` is a lot more ergonomic. `tevmDeploy` has access to all the [special cheat properties](https://tevm.sh/reference/tevm/actions-types/type-aliases/basecallparams/) that a normal [`tevmCall`](https://tevm.sh/reference/tevm/actions-types/type-aliases/callparams/) has.

We also could use [`tevmSetAccount`](https://tevm.sh/reference/tevm/decorators/type-aliases/tevmactionsapi/#setaccount) and manually set the [`deployedBytecode`](https://tevm.sh/reference/tevm/actions-types/type-aliases/setaccountparams/#deployedbytecode) and any [contract storage](https://tevm.sh/reference/tevm/actions-types/type-aliases/setaccountparams/#state) we want to set. This is a fine way to do it as well and often the most convenient if you don't need to execute the constructor code. For our simple contract we will use tevmDeploy here.

### 1. Use `tevmDeploy` to deploy a contract.

```typescript
// tevm/contracts has utils for creating `contracts` and `scripts` which we will cover later
// it also offers small library of commonly used contracts
import { SimpleContract } from "tevm/contract";

async function runApp() {
  // go ahead and delete the old code

  const initialValue = 420n;
  const deployResult = await memoryClient.tevmDeploy({
    from: prefundedAccounts[0],
    abi: SimpleContract.abi,
    // make sure to use bytecode rather than deployedBytecode since we are deploying
    bytecode: SimpleContract.bytecode,
    args: [initialValue],
  });
  if (deployResult.errors) throw deployResult.errors;

  status.innerHTML = `Mining contract deployment tx ${deployResult.txHash} for contract ${deployResult.createdAddress}...`;

  // remember to mine!
  await memoryClient.tevmMine();

  status.innerHTML = `updating ui to reflect newly mined tx ${deployResult.txHash} deploying contract ${deployResult.createdAddress}...`;

  // Pass in the contract address to updateAccounts
  // we will update this function to display contract info in next step
  await updateAccounts(deployResult.createdAddress as Address);

  status.innerHTML = "Done";
}
```

:::tip[abitype best practices]
Tevm uses [abitype](https://abitype.dev/) for it's TypeScript types.

- Use `as const` anytime you declare an address, hex string, abi, or human readable abi
- Avoid using JSON abis as JSON abis hurt abitypes ability to infer types. The Tevm compiler will remove this restriction in a future version.
- If you prefer your address types to be of type String rather than address, you [can modify the type](https://abitype.dev/config#addresstype)

If you have issues with typescript typings and find yourself fighting the compiler, join the [tevm telegram](https://t.me/+ANThR9bHDLAwMjUx) and ask for help. One of the many Typescript wizards will help.
:::

### 2. Update the html to display contract information

```typescript
async function runApp() {
  app.innerHTML = `<div id="status">initializing...</div>
  <div id="blocknumber"></div>
  <div>
    Address: <span id="address"></span>
  </div>
  <div>
    Nonce: <span id="nonce"></span>
  </div>
  <div>
    Balance: <span id="balance"></span>
  </div>
  <h1>Counter contract</h1>

  <!-- Contract info -->
  <table border="1" id="contractInfo">
      <thead>
          <tr id="contractInfoHeader">
              <!-- We will fill this in in js -->
          </tr>
      </thead>
      <tbody>
          <tr id="contractInfoRow">
              <!-- We will fill this in in js -->
          </tr>
      </tbody>
  </table>
  `;
  ...
}
```

### 3. Update `updateAccounts` to display the contract in html

Now use `tevmGetAccount` to fill in the table information in `updateAccounts`. This way we can be assured our contract is deployed correct.

Pass in the contract address as a param

```typescript
import { createMemoryClient, http, type Address } from "tevm";
...
// const address = `0x${"0420".repeat(10)}` as const;
async function updateAccounts(address: Address) {
  const account = await memoryClient.tevmGetAccount({
    address,
    throwOnFail: false,
  });
  if (account.errors) throw account.errors
  console.log(account); // console log the account to get familiar with what properties are on it
  document.querySelector("#address")!.innerHTML = address;
  document.querySelector("#nonce")!.innerHTML = String(account.nonce);
  document.querySelector("#balance")!.innerHTML = String(account.balance);

  // Update contract account info
  const contractAccount = await memoryClient.tevmGetAccount({
    address: contractAddress,
    throwOnFail: false,
    returnStorage: true,
  });
  if (contractAccount.errors) throw contractAccount.errors;

  const header = document.querySelector("#contractInfoHeader")!;
  const info = document.querySelector("#contractInfoRow")!;

  header.innerHTML = `<tr>Address</tr>
  <tr>deplyedBytecode</tr>
  ${Object.keys(contractAccount.storage ?? []).map((storageSlot) => `<tr>${storageSlot}</tr>`)}
  `;

  info.innerHTML = `<tr>${contractAccount.address}</tr>
  <tr>${contractAccount.deployedBytecode}</tr>
  ${Object.values(contractAccount.storage ?? []).map((storageValue) => `<tr>${storageValue}</tr>`)}
  `;
}
...
```

We should see the contract information show up in our html now.

## Using the `tevmContract` action

### 1. Use `tevmContract` to write to our contract

[`tevmContract`](https://tevm.sh/reference/tevm/actions-types/type-aliases/contracthandler/) is has a similar api to [readContract](https://viem.sh/docs/contract/readContract.html) from viem and has the followign advantages over a normal `tevmCall`.

- automatically encodes the call data without needing to manually use [`encodeFunctionData`](https://tevm.sh/reference/tevm/utils/functions/encodefunctiondata/)
- automatically decodes the return data without needing to manually use [`decodeFunctionResult`](https://tevm.sh/reference/tevm/utils/functions/decodefunctionresult/)
- automatically decodes any revert messages without needing to manually use [`decodeErrorResult`](https://tevm.sh/reference/tevm/utils/functions/decodeerrorresult/)
- throws useful warnings such as no contract bytecode existing at the contract address

Let's use tevm.contract to both read and write to the contract we just deployed. Feel free to add the results of these calls to the dom we will just console log them for now in this tutorial.

This particular contract has two methods. `get` to get the stored value and `set` to set the stored value.

For convienience we will also call [`Contract.withAddress`](https://tevm.sh/reference/tevm/contract/type-aliases/contract/#withaddress) to add the deployed address to the contract instance

```typescript
async function runApp() {
  ...

  const deployedContract = SimpleContract.withAddress(deployResult.createdAddress as Address);

  status.innerHTML = "Querying contract with tevmContract..."

  const contractResult = await memoryClient.tevmContract({
    abi: deployedContract.abi,
    functionName: "get",
    to: deployedContract.address,
  });
  if (contractResult.errors) throw contractResult.errors;
  console.log(contractResult.rawData); // returns the raw data returned by evm
  console.log(contractResult.data); // returns the decoded data. Should be the initial value we set
  console.log(contractResult.executionGasUsed); // returns the execution gas used (won't include the data cost or base fee)
  // console log the entire result to become familiar with what all gets returned

  const newValue = 10_000n
  status.innerHTML = `Current value ${contractResult.data}. Changing value to ${newValue}`

  // just like tevmCall we can write with `createTransaction: true`
  // remember the default `from` address is `prefundedAccounts[0]` when not specified!
  const writeResult = await memoryClient.tevmContract({
    createTransaction: true,
    abi: deployedContract.abi,
    functionName: "set",
    to: deployedContract.address,
    args: [newValue],
  });

  status.innerHTML =`Current value ${contractResult.data}. Changing value to ${newValue}. Mining tx ${writeResult.txHash}`

  // remember to mine
  const mineResult = await memoryClient.tevmMine();

  // feel free to double check the value actually changed by calling tevmContract again!

	status.innerHTML = `Value changed in block ${mineResult.blockHashes?.join(',')}. Updating storage in html...`;

  // now let's refresh the account information to update storage
  await updateAccounts(deployResult.createdAddress as Address);
}
```

### 2. Use getTransactionReceipt to get the receipt

Remember after mining new blocks [getTransactionReceipt](https://viem.sh/docs/actions/public/getTransactionReceipt#gettransactionreceipt) will return the receipt

```typescript
const receipt = await memoryClient.getTransactionReceipt({
  hash: writeResult.txHash as Hex,
});
console.log(receipt);
```

### 3. Refactor contract code to use contract action creators

Tevm ships with contract action creators which compose with [tevmContract](https://tevm.sh/reference/tevm/actions-types/type-aliases/contracthandler/#_top) as well as viem methods such as [readContract](https://viem.sh/docs/contract/readContract.html).

These action creators are even more powerful when combined with the tevm compiler which we will cover later in this guide.

Refactor our contract call to use the contract action creator. Note: the returned value of the action creator matches exactly what we had before.

```typescript
const deployedContract = simpleContract.withAddress(deployResult.address)

const contractResult = await memoryClient.tevmContract(
  deployedContract.read.get()
);

...

const contractResult = await memoryClient.tevmContract({
  createTransaction: true,
  ...deployedContract.write.set(10_000n)
});
```

:::tip[Creating contracts and scripts]
We can create our own contracts and scripts with the Tevm bundler (covered in the next step) and also with `createContract`. `createContract` is a pure contract with only abi while calling `contract.script()` holds also bytecode information for deployless calls.

If the address is known ahead of time use `withAddress` to add the address to the contract or it can be passed into constructor.

```typescript
import { createContract } from "tevm/contracts";

export const myContract = createContract({
  name: "MyErc721",
  humanReadableAbi: ["function balanceOf(address): uint256"],
}).withAddress(contractAddress);
```

:::

## Compiling contracts with the Tevm bundler

Tevm not only supplies a runtime EVM but also a [buildtime tool](https://tevm.sh/learn/solidity-imports/) for building your contracts within your JavaScript projects. It will compile your contracts for you via simply importing a solidity file.

In future versions [`whatsabi` integration](https://github.com/shazow/whatsabi) will also be added to be able to pull contracts that are deployed to live networks.

This bundler will give you a lot of great features such as

- natspec on hover
- go-to-definition taking you directly to the solidity contract definitions
- automatically recompiling when you change the contract code
- support for most bundlers including webpack, vite, esbuild, rollup, and bun
- typesafe feedback whenever you change your contract code

![Gif showing lsp features](https://github.com/evmts/evmts-monorepo/assets/35039927/ac46caf3-32cc-4ec5-8b3b-5e1df3f7819a)

Tevm supports all major bundlers including vite, rollup, webpack, rspack, bun and esbuild. If your bundler is not supported open an issue it's likely a light lift to add support.

### 1. Configure vite

Configuring vite will allow vite to recognize solidity imports. When it sees solidity it will compile it into the abi and bytecode to make a `tevm contract` just like we made manually in `counterContract.ts`

Add the `viteExtensionTevm` to your vite config under `plugins`

```bash
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { vitePluginTevm } from 'tevm/bundler/vite-plugin'

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

### 3. Configure the LSP

Configuring a typescript plugin allows any editor such as VSCode or neovim to recognize the correct type of contract imports. This should be added to your tsconfig automatically via restarting your vite serve.

To add it manually, add the `@tevm/ts-plugin` to the typescript config. It will be automatically added if it doesn't already exist.

```json
{
  "compilerOptions": {
    "plugins": [
       {name: '@tevm/ts-plugin'}
    ],
    ...
}
```

Now restart your editor/lsp and typescript will now be able to recognize your contract imports.

Note: If using vscode you will need to [set the workspace version](https://code.visualstudio.com/docs/typescript/typescript-compiling#_using-the-workspace-version-of-typescript) to load ts-plugins

:::tip[Solidity import best practices]
Importing solidity directly is a convenience for when you are developing scripts and contracts within the same codebase as your javascript. It is NOT recomended to copy paste contracts just to use them with the tevm bundler. Instead consider the following options if the contract isn't in your code base.

If the contract you wish to use is external to your code base here are the options:

1. If contract is on npm or github you can npm install the package and then import it from node_modules. The tevm compiler supports node_resolution to import from other monorepo packages and node_modules
2. In future versions whatsabi integration will allow you to generate the contracts via pointing at a block explorer
3. Finally the most manual way of creating a contract is to use human readable abi for any contract methods you need using `createScript` or `createContract` <- TODO link to reference docs. You only need to include the methods you wish to use

:::

### 4. Add a counter contract

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

### 5. Import the contract and console.log it

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

You will be able to see the TypeScript the contract is compiled to in the [`.tevm` cache folder](https://tevm.sh/reference/tevm/config/types/type-aliases/compilerconfig#cachedir)

Contracts can be created manually using `createScript` or `createContract`

```typescript
import { createContract } from "tevm/contracts";

const myContract = createContract({
  name: "MyErc721",
  humanReadableAbi: ["function balanceOf(address): uint256"],
});
```

:::tip[Configuring the compiler]
The tevm compiler works with no config. But you can also optionally configure it via creating a `tevm.config.json` file to configure things such as remappings.
See [config options](https://tevm.sh/reference/tevm/config/types/type-aliases/compilerconfig#_top) for more info.
:::

## Advanced feature: Scripting

At this point we have covered all the major functionality of tevm and will be diving into more advanced features. Consider trying the following if you are up to it:

1. Deploy the contract using `tevm.setAccount` this time to any address you prefer
2. Use `tevm.setAccount` or the viem method `tevm.setStorageAt` to modify the storage of your contract without needing to create a transaction
3. Try out the `tevmDumpStorage` action. Together with `loadStorage` this method can be used to hydrate and persist the tevm evm state.

### Basic scripting

Like foundry, Tevm offers an extremely powerful solidity scripting environment. Tevms scripts are very tightly integrated into typescript and also include the ability to execute arbitrary typescript within them.

Any solidity contract can be ran as a script. For example, let's run our counter script. Since we already experimented with browser let's try using it in `vitest`

#### 1. Install vitest

`npm install vitest --save-dev`

Vitest will work with the same tevm plugin we already installed.

#### 2. Import your script and execute it

Create a new test file

```typescript
touch src/counter.spec.ts
```

```typescript
import { createMemoryClient } from "tevm";
import { Counter } from "../contracts/Counter.s.sol";
import { test, expect } from "vitest";

test("scripting", () => {
  // let's just throw on fail since we are just playing with scripts not building a production app
  const memoryClient = createMemoryClient();

  const scriptResult = await memoryClient.tevmContract(Counter.read.count());

  expect(scriptResult).toMatchInlineSnapshot();
});
```

Now run the test to snapshot the script result via updating the `test` command in `package.json`

```
"test": "vitest"
```

Notice we never had to deploy our script. Tevm scripts will deploy the script for you and then execute them. Tevm scripts will not execute the constructor though as they use `tevmSetAccount` not `tevmDeploy` to deploy the contract.

:::tip[Script best practice]
Scripts are supposed to be short lived. If you need to make more than one request to the contract it is better to deploy the contract with `tevmDeployContract` or `tevmSetAccount`.
:::

## Precompiles

Tevm does not have an enumerated set of cheat codes like foundry but instead just offers a way of executing arbitrary javascript within your scripts. This allows you to do wild stuff theoretically like

- Read and write to the file system within solidity contract
- Read and write to the dom within solidity contracts
- Build a tool that allows users to write servers or indexers in solidity
- One could implement `foundry compatability` such that they actually could use foundry cheat codes even in tevm. Foundry scripts in browsers!
- I'm sure there are even more creative use cases that you can think of

Precompiles require 3 steps to create.

1. Create an interface in solidity
2. Implement the interface in TypeScript
3. Initialize MemoryClient with the precompiles
4. Either pass in precompiles as arguments to your scripts (my preference), or use their hardcoded addresses.

Let'do create a precompile to read and write to the file system.

### 1. Create a solidity interface in `contracts/Fs.sol`

The solidity interface will be used when calling precompiles within solidity and also used to make the JavaScript implementation typesafe.

```bash
touch contracts/Fs.sol
```

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

### 2. Implement your precompile using `createPrecompile`

By importing our precompile interface and passing it to `createPrecompile` typescript will make sure we are implementing every method and returning the correct data type.

The return value of a precompile contains both a value but it also can return logs and gasUsed. We will simply return a value and charge 0 gas.

The tevm compiler makes this very easy and typesafe.

```bash
touch src/fsPrecompile.ts
```

```typescript
import fs from "node:fs/promises";
import { defineCall, definePrecompile } from "tevm";
import { Fs } from "../contracts/Fs.sol";

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

### 3. Now call precompiles from your scripts

We can write solidity scripts that execute our JavaScript now.

```bash
touch contracts/WriteHelloWorld.s.sol
```

Using the `.s.sol` extension tells the tevm compiler it's a script and thus should compile it's bytecode.

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

### 4. Pass precompile to `createMemoryClient` and call script

```typescript
import { expect, test } from "vitest";
import { createMemoryClient } from "tevm";

import { existsSync, rmSync } from "node:fs";
import { fsPrecompile } from "./fsPrecompile.js";

import { WriteHelloWorld } from "../contracts/WriteHelloWorld.s.sol";

test("Call precompile from solidity script", async () => {
  const client = createMemoryClient({
    customPrecompiles: [fsPrecompile.precompile()],
    loggingLevel: "trace",
  });

  await client.tevmContract({
    ...WriteHelloWorld.write.write(fsPrecompile.contract.address),
    throwOnFail: false,
  });

  expect(existsSync("test.txt")).toBe(true);

  rmSync("test.txt");
});
```

## Next steps

### What else can tevm do?

We have now implemented all major features of Tevm into a simple application running the EVM. The use cases from here are vast.

There are more features to explore such as

- diving deeper into the viem actions api
- the low level apis are open to use such as `getTxPool()`, `getReceiptsManager()`, and `getVm()`
- After calling `getVm()` you can explore the vm methods such as `vm.buildBlock`, stateManager methods such as `vm.stateManager.setStateRoot`, blockchain methods `vm.blockchain.getBlock`, and evm methods like `vm.evm.runCall`. This low level api uses the [`ethereumjs api`](https://github.com/ethereumjs)
- Set `loggingLevel` in memory client to `trace` or `debug`
- Configure the tevm bundler to read foundry remappings
- Hack the evm using `client.tevm.getVm().evm.on` to log evm steps or modify the result of them (see ethereumjs generated evm docs for more information on this)
- Use the `statepersister` to persist tevm state to local storage
- Run tevm as an http server

### Running tevm as a server

Tevm can run as an http server via the `tevm/server` subpackage.

```typescript
import { createServer } from "tevm/server";
import { createMemoryClient } from "tevm";

const memoryClient = createMemoryClient();

const server = createServer({
  request: tevm.request,
});

server.listen(8080, () => console.log("listening on 8080"));
```

- In addition to `createServer` which creates a node http server there is also a generic http handler, express middleware, and a next.js server available in the `tevm/server` package.
- If you create a server you can talk to it with a normal viem client.
- If you wish to add the custom tevm actions to a viem client using it's decorators.

```typescript
import {tevmActions} from '@tevm/actions'
import {createPublicClient, http} from 'viem'

const client = createPublicClient({transport: 'https://localhost:8080'}).extend(tevmActions())

client.tevmContract(...)
```

- If you prefer ethers the [`@tevm/ethers`](https://github.com/evmts/tevm-monorepo/tree/main/extensions/ethers) package provides an ethers provider that uses tevm as it's in memory backend similar to MemoryClient.
- Tevm supports advanced tracing apis. Try passing `createTrace` or `createAccessList` to a tevmCall or tevmContract.

### Subpackages

The [Tevm monorepo](https://github.com/evmts/tevm-monorepo) believes in making all it's internal subpackages publically available. Thus tevm has over 60 packages available for use that can be explored. Some notable ones

- `@tevm/contracts` which was used extensively in this tutorial built on top of abitype and wagmi/viem apis. It along with the tevm bundler works great with wagmi/viem and ethers even without using the rest of tevm.
- `@tevm/solc` provides a typesafe wrapper around solc
- `@tevm/ethers` has a tevm memory provider as well as a typesafe version of `Contract` that uses abitype to give it typechain-like typesafety.
- `@tevm/revm` compiles revm to wasm as an experiment to try to implement the Evm in wasm.
- `@tevm/actions` has the tevm actions api as well as eth json-rpc handlers available as tree-shakable actions.
- `@tevm/state`, `@tevmtx`, `@tevm/blockchain` have custom tevm implementations of [ethereumjs components](https://www.google.com/search?q=ethereumjs+github&oq=ethereumj&gs_lcrp=EgZjaHJvbWUqDggAEEUYJxg7GIAEGIoFMg4IABBFGCcYOxiABBiKBTIGCAEQRRg5MgYIAhBFGEAyBggDEEUYPDIGCAQQRRg8MgYIBRBFGDwyBggGEEUYPDIGCAcQRRhBqAIAsAIA&sourceid=chrome&ie=UTF-8)

Also every subpackage in `tevm-bundler` and `tevm` packages is available as a standalone package if you want to minimize how much code gets installed. E.g. `tevm/contracts` can be installed standalone as `@tevm/contracts`

### Ethereumjs

Tevm is built on top of [ethereumjs](https://github.com/ethereumjs/ethereumjs-monorepo). Most of Tevm is custom built for tevm except for the Evm but it's internal api still follows the same interface of ethereumjs.

Custom functionality can be built into tevm by third party developers via decorating any given ethereumjs or tevm component with new functionality or writing from scratch a component that implements the interface.

### Star and join discord

Finally if you enjoy tevm consider staring the github and joining the telegram!
