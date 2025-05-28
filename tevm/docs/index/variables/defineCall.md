[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / defineCall

# Variable: defineCall()

> `const` **defineCall**: \<`TAbi`\>(`abi`, `handlers`) => (`{ data, gasLimit, }`) => `Promise`\<[`ExecResult`](../../evm/interfaces/ExecResult.md)\>

Defined in: packages/precompiles/dist/index.d.ts:215

Defines a call handler for a contract precompile by mapping function names to handler implementations.

The defineCall function takes an ABI and a map of function names to handler implementations.
Each handler receives the decoded function arguments and gas limit, and returns a result
that will be encoded according to the ABI.

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](../type-aliases/Abi.md)

## Parameters

### abi

`TAbi`

### handlers

`{ [TFunctionName in ExtractAbiFunctionNames<TAbi>]: Handler<TAbi, TFunctionName> }`

## Returns

> (`{ data, gasLimit, }`): `Promise`\<[`ExecResult`](../../evm/interfaces/ExecResult.md)\>

### Parameters

#### \{ data, gasLimit, \}

##### data

`` `0x${string}` ``

##### gasLimit

`bigint`

### Returns

`Promise`\<[`ExecResult`](../../evm/interfaces/ExecResult.md)\>

## Example

```js
import { defineCall } from '@tevm/precompiles'
import { parseAbi } from '@tevm/utils'

const abi = parseAbi([
  'function readFile(string path) view returns (string)',
  'function writeFile(string path, string content) returns (bool)'
])

const fsCall = defineCall(abi, {
  readFile: async ({ args }) => {
    const [path] = args
    return {
      returnValue: await fs.readFile(path, 'utf8'),
      executionGasUsed: 0n
    }
  },
  writeFile: async ({ args }) => {
    const [path, content] = args
    await fs.writeFile(path, content)
    return {
      returnValue: true,
      executionGasUsed: 0n
    }
  }
})
```
