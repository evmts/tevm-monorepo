[**@tevm/precompiles**](../README.md)

***

[@tevm/precompiles](../globals.md) / CustomPrecompile

# Type Alias: CustomPrecompile

> **CustomPrecompile** = `Exclude`\<`Exclude`\<`Parameters`\<*typeof* `Evm$1`\[`"create"`\]\>\[`0`\], `undefined`\>\[`"customPrecompiles"`\], `undefined`\>\[`number`\]

Defined in: evm/dist/index.d.ts:76

Custom precompiles allow you to run arbitrary JavaScript code in the EVM

## Example

```typescript
import { createMemoryClient } from 'tevm'
import { type CustomPrecompile } from 'tevm/evm'
import { definePrecompile, defineCall } from 'tevm'
import { createContract } from 'tevm/contract'

const precompileContract = createContract({
  name: 'Precompile',
  humanReadableAbi: [
    'function cwd(string) returns (string)',
  ],
})
const customPrecompiles: CustomPrecompile = definePrecompile({
  contract: precompileContract,
  call: defineCall(precompileContract.abi, {
    cwd: async ({ args }) => {
      return {
        returnValue: process.cwd(),
        executionGasUsed: 0n,
      }
    },
  }),
})

const memoryClient = createMemoryClient({ customPrecompiles: [customPrecompiles] })
```

## See

 - [Scripting guide](https://tevm.sh/learn/scripting/)
 - [definePrecompile](https://tevm.sh/reference/tevm/precompiles/functions/defineprecompile/)
 - [MemoryClient](https://tevm.sh/reference/tevm/memory-client/type-aliases/memoryclient/)
