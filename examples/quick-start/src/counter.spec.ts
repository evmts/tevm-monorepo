import { createMemoryClient } from 'tevm'
import { expect, test } from 'vitest'

import { rmSync } from 'node:fs'
import { join } from 'node:path'
import { fsPrecompile } from './fsPrecompile.js'

// To get rid of the red underline for this import you must use the local typescript version
// https://code.visualstudio.com/docs/typescript/typescript-compiling#_using-the-workspace-version-of-typescript
// > Typescript: Select Typescript version: Use Workspace Version
import { WriteHelloWorld } from '../contracts/WriteHelloWorld.s.sol'

test('Call precompile from solidity script', async () => {
	const filePath = join(__dirname, 'test.txt')
	const message = 'Hello, World!'
	const client = createMemoryClient({
		/**
		 * THis precompile allows our solidity script to use `fs.writeFile` to write to the filesystem
		 */
		customPrecompiles: [fsPrecompile.precompile()],
	})

	expect(
		/**
		 * `tevmScript` runs arbitrary solidity scripts on the memory client
		 */
		await client.tevmContract({
			deployedBytecode: WriteHelloWorld.deployedBytecode,
			/**
			 * Tevm scripts when imported with the tevm compiler provide a stramlined dev experience where contract building happens directly via a
			 * javascript import.
			 */
			...WriteHelloWorld.write.hello(fsPrecompile.contract.address, filePath, message),
			throwOnFail: false,
		}),
	).toMatchInlineSnapshot(`
		{
		  "amountSpent": 179067n,
		  "createdAddresses": Set {},
		  "data": undefined,
		  "executionGasUsed": 2129n,
		  "gas": 29974419n,
		  "logs": [],
		  "rawData": "0x",
		  "selfdestruct": Set {},
		  "totalGasSpent": 25581n,
		}
	`)

	// test the solidity script wrote to the filesystem
	expect(
		await client.tevmContract({
			/**
			 * Tevm scripts when imported with the tevm compiler provide a stramlined dev experience where contract building happens directly via a
			 * javascript import.
			 */
			...fsPrecompile.contract.read.readFile(filePath),
			throwOnFail: false,
		}),
	).toMatchInlineSnapshot(`
		{
		  "amountSpent": 157640n,
		  "data": "Hello, World!",
		  "executionGasUsed": 0n,
		  "rawData": "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000d48656c6c6f2c20576f726c642100000000000000000000000000000000000000",
		  "totalGasSpent": 22520n,
		}
	`)

	rmSync(filePath)
})
