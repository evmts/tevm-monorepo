import fs from 'node:fs/promises'
import { defineCall, definePrecompile } from 'tevm'
/**
 * The tevm compiler allows us to import the solidity contract into javascript
 * `definePrecompile` will typecheck we implement it's interface correctly in typescript
 * To get rid of the red underline for this import in stackblitz or vscode you must use the local typescript version
 * https://code.visualstudio.com/docs/typescript/typescript-compiling#_using-the-workspace-version-of-typescript
 * > Typescript: Select Typescript version: Use Workspace Version
 */
import { Fs } from '../contracts/Fs.sol'

/**
 * A precompile build with tevm that allows the use of `fs.readFile` and `fs.writeFile` in Solidity scripts
 */
export const fsPrecompile = definePrecompile({
	contract: Fs.withAddress('0xf2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2'),
	call: defineCall(Fs.abi, {
		readFile: async ({ args }) => {
			console.log('readFile', args)
			return {
				returnValue: await fs.readFile(...args, 'utf8'),
				executionGasUsed: 0n,
			}
		},
		writeFile: async ({ args }) => {
			console.log('writeFile', args)
			await fs.writeFile(...args)
			return { returnValue: true, executionGasUsed: 0n }
		},
	}),
})
