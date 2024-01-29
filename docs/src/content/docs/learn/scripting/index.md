---
title: Advanced scripting guide
description: TODO
---

## Advanced scripting

Scripting is a powerful unlock for JavaScript applications. When used well you will start to find scripting to be some of the best ways to accomplish building your applications.

## Using precompiles

With `tevm.script` you can run solidity in TypeScript. But what if you want to run TypeScript in your solidity? For example you may want to call `fs.readFile` directly in your solidity script. To do this you can use the `tevm/precompiles` package.

Precompiles are simply contracts deployed to an address that execute a JavaScript function you define instead of solidity. 

In this tutorial we will create a precompile with the [tevm bundler](../solidity-imports/) enabled which allows us to import solidity into TypeScript files. This can be done using [`import { createScript } from 'tevm/contract`](../contracts/) if the tevm bundler is not available in your project. The steps remain the same just write the solidity interface with human readable abi rather than importing it if not using a bundler.

### 1. Define a solidity interface for your precompile

The interface you define will be used both by your JavaScript precompile and any scripts you write.

```typescript fs.sol
// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

interface Fs {
    /**
     * @notice Event for when file write is successful
     */
    event FileWrite(address indexed sender, string path, string data);
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

### 2. Define the javascript ipmlementation

A precompile is defined with following

1. A [`Script` contract](/reference/tevm/contract/typedefs/script) with `withAddress` called 
2. The call function that returns an [CallResult](/reference/tevm/precompiles/typedefs/CallResult)

You can define the call function from scratch. It is passed the raw data and you can use `decodeFunctionData` to decode it. You can use `encodeFunctionResult` to encode the return type

Rather than defining a call from scratch we are going to use the [`defineCall`](/reference/tevm/precompiles/functions/defineCall) utility. This utility will take an ABI and then allow us to fill in the interface for the precompile in a typesafe way. It will return the proper types from the ABI.  It will also handle the encoding and decoding for you nicely.

```typescript fsPrecompile.ts
import fs from 'fs/promises'
import { defineCall, definePrecompile } from '@tevm/precompiles'
// Import the precompile interface or create one with `createContract`
import { Fs } from './Fs.sol'

    // The precompile interface contract must be configured with an address
const contract = Fs.withAddress('0xf2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2')

// defineCall lets us create the call handler in a typesafe way
const call = defineCall(Fs.abi, {
	// the abi will typecheck that we are implementing every method with the correct returnValue
	writeFile: async ({ args }) => {
		await fs.writeFile(...args)
		return { 
			returnValue: true, 
			executionGasUsed: 0n, 
			logs: [contract.events.FileWrite(...args)]
		}
	},
	readFile: async ({ args }) => {
		return {
			returnValue: await fs.readFile(...args, 'utf8'),
			executionGasUsed: 0n,
		}
	},
})

export const fsPrecompile = definePrecompile({
    contract,
    call,
})
```

### 3. Pass your precompile into `MemoryClient`

Pass your precompile into the [MemoryClient](../clients/) to configure the VM with it.

We can use our precompile just like any other solidity contract.

```typescript example.ts
import {createMemoryClient} from '@tevm/memory-client'
import {fsPrecompile} from './fsPrecompile.js'
	
const client = await createMemoryClient({
	customPrecompiles: [fsPrecompile.precompile()],
})

await client.contract(
	fsPrecompile.contract.write.writeFile('./test.txt', 'hello world'),
)

import {readFileSync} from 'fs'
console.log(readFileSync('./test1.txt')) // 'hello world'
```

### 4. Use in solidity code

In previous section we called our precompile from typescript. We can also call it from solidity.

To use it we simply just import it's interface. We also need the address which can either be hardcoded or passed in as a parameter.

```solidity ReadHelloWorld.sol
// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

import {Fs} from "./Fs.s.sol";

contract ReadHelloWorld {
    function readFileFromSolidity(Fs fs, string path) public view returns (string) {
        return fs.readFile(path);
    }
}
```

We can now call our contract in TypeScript

```typescript example.ts
import {createMemoryClient} from '@tevm/memory-client'
import {fsPrecompile} from './fsPrecompile.js'
import {ReadHelloWorld} from './ReadHelloWorld.sol'
	
const client = await createMemoryClient({
	customPrecompiles: [fsPrecompile.precompile()],
})

// call our precompile directly
await client.contract(
	fsPrecompile.contract.write.writeFile('./test.txt', 'hello world'),
)

// call our contract that uses our precompile
const result = client.contract(
  await ReadHelloWorld.read.readFileFromSolidity('./test.txt')
)

console.log(result) // hello world
```

## Best practices

1. Distributing your precompiles if building a library

If you are building precompiles for others to use outside of your code base you should build your code with a bundler such as `rollup` `esbuild` or `vite` so others can use your precompiles without needing to build your solidity contracts. Alternatively you can use the `createContract` function to create the javascript contract rather than importing solidity.

You should also includ the precompile contract in your npm library so it can be imported in solidity

2. Use `defineCall`

Using `defineCall` guarantees typesafety for your precompile and it's interface.

3. Be careful about forking and reverting

Precompiles can operate outside of the EVM state like in our example where we are writing to file system. If you take an action such as reverting the block it won't unwrite from the file system. Be careful for situations where a precompile might cause issues like this.
