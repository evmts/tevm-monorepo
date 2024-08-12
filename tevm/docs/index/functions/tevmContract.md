[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / tevmContract

# Function: tevmContract()

> **tevmContract**\<`TAbi`, `TFunctionName`\>(`client`, `params`): `Promise`\<[`ContractResult`](../type-aliases/ContractResult.md)\<`TAbi`, `TFunctionName`\>\>

A tree-shakeable version of the `tevmContract` action for viem.
Interacts with a contract method call using TEVM.

Internally, `tevmContract` wraps `tevmCall`. It automatically encodes and decodes the contract call parameters and results, as well as any revert messages.

## Type Parameters

• **TAbi** *extends* [`Abi`](../type-aliases/Abi.md) \| readonly `unknown`[] = [`Abi`](../type-aliases/Abi.md)

• **TFunctionName** *extends* `string` = [`ContractFunctionName`](../type-aliases/ContractFunctionName.md)\<`TAbi`\>

## Parameters

• **client**: `Client`\<[`TevmTransport`](../type-aliases/TevmTransport.md)\<`string`\>\>

• **params**: [`ContractParams`](../type-aliases/ContractParams.md)\<`TAbi`, `TFunctionName`\>

## Returns

`Promise`\<[`ContractResult`](../type-aliases/ContractResult.md)\<`TAbi`, `TFunctionName`\>\>

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
 - [TEVM Actions Guide](https://tevm.sh/learn/actions/)

## Defined in

packages/memory-client/types/tevmContract.d.ts:39
