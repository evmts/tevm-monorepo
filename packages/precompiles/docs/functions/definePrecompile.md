[**@tevm/precompiles**](../README.md)

***

[@tevm/precompiles](../globals.md) / definePrecompile

# Function: definePrecompile()

> **definePrecompile**\<`TContract`\>(`__namedParameters`): `Precompile`\<`TContract`\>

Defined in: [definePrecompile.ts:51](https://github.com/evmts/tevm-monorepo/blob/main/packages/precompiles/src/definePrecompile.ts#L51)

Defines a precompile contract that executes JavaScript code instead of EVM bytecode.

A precompile is a special kind of contract that is deployed at a specific address
but executes JavaScript code rather than EVM bytecode. This allows for implementing
functionality that would be difficult or inefficient to implement in Solidity.

## Type Parameters

### TContract

`TContract` *extends* `Contract`\<`any`, `any`, `` `0x${string}` ``, `any`, `any`, `any`\> = `Contract`\<`string`, readonly `string`[], `` `0x${string}` ``, `any`, `any`, `any`\>

## Parameters

### \_\_namedParameters

#### call

(`context`) => `Promise`\<`ExecResult`\>

#### contract

`TContract`

## Returns

`Precompile`\<`TContract`\>

## Example

```js
import { defineCall, definePrecompile } from '@tevm/precompiles'
import { Contract } from '@tevm/contract'
import { parseAbi } from '@tevm/utils'

// Define a contract interface
const fsAbi = parseAbi([
  'function readFile(string path) view returns (string)',
  'function writeFile(string path, string content) returns (bool)'
])

const FsContract = {
  abi: fsAbi,
  address: '0xf2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2'
} as const

// Create precompile with handlers
const fsPrecompile = definePrecompile({
  contract: FsContract,
  call: defineCall(fsAbi, {
    readFile: async ({ args }) => {
      return {
        returnValue: await fs.readFile(args[0], 'utf8'),
        executionGasUsed: 0n
      }
    },
    writeFile: async ({ args }) => {
      await fs.writeFile(args[0], args[1])
      return {
        returnValue: true,
        executionGasUsed: 0n
      }
    }
  })
})
```
