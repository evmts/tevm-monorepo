---
title: Quick start guide
description: A quick introduction to Tevm
---

# Tevm Quick Start Guide

## Quickest start

If you prefer to dive in to a batteries included project use the Tevm cli to initialize a project

```
npx tevm create my-app
```

## Introduction

This guide will get you familiar with the most essential features of Tevm and start interacting with the Ethereum Virtual Machine (EVM) in Node.js or browser environments with `Tevm`. By the end of this guide you will understand:

1. How to create a forked EVM in JavaScript using `createTevm`
2. How to write ,build, and execute solidity scripts with `tevm`
3. How to streamline your workflow using `tevm contract imports` with the tevm bundler 

## Prerequisites

- Node.js (version 18 or above) or Bun. 

This tutorial uses Bun. You can install Bun globally with Node.js

```
npm install --global bun
```

For more details visit the [Bun Installation Guide](https://bun.sh/docs/installation).

## Creating Your Tevm Project

1. Create a new project directory:

```bash
mkdir tevm-app && cd tevm-app
```

2. Initialize your project with Bun:

```bash
bun init
```

3. Install tevm

```bash
bun install tevm
```

## Creating a Tevm VM

Now let's create a Tevm VM to execute Ethereum bytecode in our JavaScript

1. Create a JavaScript file:

```bash
touch vm.js
```


2. Now initialize the Tevm vm forking optimism

```typescript
import { Tevm } from 'tevm';

const vm = await Tevm.create({
  fork: { url: 'https://mainnet.optimism.io' }
});
```

This initializes an in memory instance of Tevm. It is similar to starting anvil but in memory in JavaScript. It will read from local state if it exists otherwise fetch and cache it from the forked url. 

3. Use ethereum action handlers

The Tevm instance provides `action handlers` similar to that of [viem public actions](https://viem.sh/docs/actions/public/introduction).

The most familiar ones will be on the `eth` namspace and map directly to the [ethereum JSON-rpc interface](https://ethereum.org/en/developers/docs/apis/json-rpc). Let's use `getBalance`

```typescript
import { Tevm } from 'tevm';

const vm = await Tevm.create({
  fork: { url: 'https://mainnet.optimism.io' }
});

const address = `0x${'1'.repeat(40)}`;

const balance = await vm.eth.getBalance({ address });

console.log(balance) // 0n
```

4. Use tevm action handlers

Tevm also provides special tevm action handlers that give you additional power to work with Tevm. Let's use `setAccount` action handler to give ourselves some eth

```typescript
import { Tevm, parseEth } from 'tevm';

const vm = await Tevm.create({
  fork: { url: 'https://mainnet.optimism.io' }
});

const address = `0x${'1'.repeat(40)}`;

await vm.setAccount({
  address,
  balance: parseEth('1')
});

const balance = await vm.eth.getBalance({ address });

console.log('balance', balance); // 100000000000000000000n
```

Now save and run the script

```bash
bun run script.js
```

5. Run a transaction

Now let's run a transaction on the VM using the special `tevm.contract` method. This method will execute any contract call against the local vm and update the state. It does not require a signer.

```typescript
import { Tevm, parseEth } from 'tevm';

const vm = await Tevm.create({
  fork: { url: 'https://mainnet.optimism.io' }
});

const address = `0x${'1'.repeat(40)}`;

await vm.setAccount({
  address,
  balance: parseEth('1')
});

const contractResult = await vm.contract({
  address: '0xCONTRACT_ADDRESS_HERE',
  method: 'mint',
  args: [address, 1],
  abi: [{todo: 'put abi here'}]
});

console.log('Gas used', contractResult.gas); //  TODO put expected amount
console.log('Events', contractResult.events); // Put events here

const balanceOfResult = await vm.contract({
  address: '0xCONTRACT_ADDRESS_HERE',
  method: 'balanceOf',
  args: [address],
  abi: [{todo: 'put abi here'}]
})
```

Now run script again to see the expected result of running the contract call.

```
bun run vm.js
```

## Scripting with Tevm

Tevm is a powerful scripting environment for running arbitrary Solidity code. This provides powerful functionality such as:

- Ability to write your own function if the view function you wish existed doesn't exist on a particular contract
- Powerful code reuse between your solidity and javascript applications
- Ability to run arbitrary javascript precompiles in your solidity scripts

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

3. Use Tevm to compile the contract into bytecode and abi

```bash
bunx tevm compile HelloWorld.s.sol
```

You should see a `.js` file get generated with the JavaScript version of your contract. Inspect the file. We will talk more about this later.

4. Create javascript file to run script

Let's use typescript this time. First create a simple tsconfig

```bash
bun install typescript && bunx tsc --init
```

And create a `script.ts` file

```bash
touch script.ts
```

5. Initialize the tevm vm and use your script in the `script` action-handler

```typescript
import { createTevm } from 'tevm';
import { HelloWorld } from './HelloWorld.s.sol.js';

const vm = await createTevm();

const scriptResult = await vm.script({
  abi: HelloWorld.abi,
  deployedBytecode: HelloWorld.deployedBytecode,
  functionName: 'greet',
  args: ['Vitalik'],
});

console.log('Script result:', scriptResult.data); // HelloWorld
```

Now run the script

```bash
bun run script.js
```

## Working with Contract Action Builders

Tevm offers an amazing typesafe dev experience for working with solidity scripts and contracts via `TevmContracts.

`TevmContracts` are created via using the `createContract` method. You may have noticed it being used in the `HelloWorld.s.sol.js` file.

Let's refactor our script code to take advantage of tevm contracts.

```typescript
- const scriptResult = await vm.script({
-   abi: HelloWorld.abi,
-   functionName: 'greet',
-   args: ['Vitalik'],
-   deployedBytecode: HelloWorld.deployedBytecode
- });
+ const scriptResult = await vm.script(
+   HelloWorld.read.greet('Vitalik')
+ );
```

## Using Tevm build tooling

Remember before we used `tevm generate` to generate JavaScript from our contract. Tevm offers tooling to do this automatically. After installing this tooling you can simply just import your contract directly.

```typescript
import {HelloWorld} from './MyContract.sol'
```

This direct solidity import will be recognized by Bun and Tevm at build time and automatically generate the JavaScript and typescript types behind the scene. You will also get enhanced `LSP` support in your editors such as Vim or VSCode. This includes

- Great typesafety
- Go-to-definition taking you directly to the solidity line of code a given method is defined
- Natspec definitions on hover

First let's configure Bun to recognize solidity files

1. Create a `plugin.js` file to install the `Tevm bun plugin` into Bun

```typescript
import { tevmBunPlugin } from '@evmts/bun-plugin';
import { plugin } from 'bun';

plugin(tevmBunPlugin({}));
```

2. Now add the `plugin.js` file to the `bunfig.toml` to tell bun to load our plugin in normal mode and dev mode

```toml
preload = ["./plugins.ts"]
[test]
preload = ["./plugins.ts"]
```

3. Remove the generated files from before

```bash
rm -rf HelloWorld.sol.js HelloWorld.sol.d.ts
```

4. Now rerun bun

```bash
bun run script.ts
```

You will see bun still generated the same files and cached them in the `.tevm` folder this time. The plugin is taking care of this generation for you whenever you run bun.

5. Configure the TypeScript LSP

Though bun is working you may notice your editor is not recognizing the solidity import. We need to also configure the TypeScript language server protocol that your editor such as `VIM` or `VSCode` uses. 

Add `{"name": "tevm/ts-plugin"}` to `compilerOptions.plugins` array to enable tevm in typescript language server.

```json
{
  "compilerOptions": {
    "plugins": [
      {"name": "tevm/ts-plugin"}
    ]
  }
}
```

Note: ts-plugins only operate on the language server. Running `tsc` from command line will still trigger errors on solidity imports. To get around this use the `tevm tsc` instead.

## Summary

Congrats. You now have learned all the basics you need to start building with `Tevm`. Consider [joining the telegram](https://todo.todo.todo) to discuss Tevm. If you build anything big or small show it off in the [tevm show and tell](https://todo.todo.todo) discussion
