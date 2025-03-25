[**@tevm/memory-client**](../README.md)

***

[@tevm/memory-client](../globals.md) / TevmContract

# Type Alias: TevmContract()

> **TevmContract** = \<`TAbi`, `TFunctionName`\>(`client`, `params`) => `Promise`\<`ContractResult`\<`TAbi`, `TFunctionName`\>\>

Defined in: [packages/memory-client/src/TevmContractType.ts:50](https://github.com/evmts/tevm-monorepo/blob/main/packages/memory-client/src/TevmContractType.ts#L50)

A type representing the handler for a TEVM contract procedure.

This type reuses the viem `contractRead`/`contractWrite` API to encode ABI, function name, and arguments.

## Type Parameters

### TAbi

`TAbi` *extends* `Abi` \| readonly `unknown`[] = `Abi`

The ABI of the contract.

### TFunctionName

`TFunctionName` *extends* `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\>

The name of the contract function.

## Parameters

### client

`Client`\<[`TevmTransport`](TevmTransport.md)\<`string`\>\>

The viem client configured with TEVM transport.

### params

`ContractParams`\<`TAbi`, `TFunctionName`\> & `CallEvents`

Parameters for the contract method call, including ABI, function name, and arguments.

## Returns

`Promise`\<`ContractResult`\<`TAbi`, `TFunctionName`\>\>

The result of the contract method call.

## Example

```typescript
import { tevmContract } from 'tevm/actions'
import { createClient, http } from 'viem'
import { optimism } from 'tevm/common'
import { createTevmTransport } from 'tevm'

const client = createClient({
  transport: createTevmTransport({
    fork: { transport: http('https://mainnet.optimism.io')({}) }
  }),
  chain: optimism,
})

async function example() {
  const res = await tevmContract(client, {
    abi: [...],
    functionName: 'myFunction',
    args: [...],
  })
  console.log(res)
}

example()
```

## See

 - [ContractParams](https://tevm.sh/reference/tevm/actions/type-aliases/contractparams/) for options reference.
 - [ContractResult](https://tevm.sh/reference/tevm/actions/type-aliases/contractresult/) for return values reference.
 - [BaseCallParams](https://tevm.sh/reference/tevm/actions/type-aliases/basecallparams-1/) for the base call parameters.
