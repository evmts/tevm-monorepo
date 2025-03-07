[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / ContractHandler

# Type Alias: ContractHandler()

> **ContractHandler**: \<`TAbi`, `TFunctionName`\>(`action`) => `Promise`\<[`ContractResult`](../../index/type-aliases/ContractResult.md)\<`TAbi`, `TFunctionName`\>\>

Defined in: packages/actions/types/Contract/ContractHandlerType.d.ts:44

Handler for executing contract interactions with the TEVM.

This handler is adapted from viem and is designed to closely match the viem `contractRead`/`contractWrite` API.
It encodes the ABI, function name, and arguments to perform the contract call.

## Type Parameters

• **TAbi** *extends* [`Abi`](../../index/type-aliases/Abi.md) \| readonly `unknown`[] = [`Abi`](../../index/type-aliases/Abi.md)

The ABI type.

• **TFunctionName** *extends* [`ContractFunctionName`](../../index/type-aliases/ContractFunctionName.md)\<`TAbi`\> = [`ContractFunctionName`](../../index/type-aliases/ContractFunctionName.md)\<`TAbi`\>

The function name type from the ABI.

## Parameters

### action

[`ContractParams`](../../index/type-aliases/ContractParams.md)\<`TAbi`, `TFunctionName`\>

The parameters for the contract call, including ABI, function name, and arguments.

## Returns

`Promise`\<[`ContractResult`](../../index/type-aliases/ContractResult.md)\<`TAbi`, `TFunctionName`\>\>

The result of the contract call, including execution details and any returned data.

## Throws

If `throwOnFail` is true, returns `TevmCallError` as value.

## Example

```typescript
import { createTevmNode } from 'tevm/node'
import { contractHandler } from 'tevm/actions'

const client = createTevmNode()

const contractCall = contractHandler(client)

const res = await contractCall({
  abi: [...], // ABI array
  functionName: 'myFunction',
  args: [arg1, arg2],
  to: '0x123...',
  from: '0x123...',
  gas: 1000000n,
  gasPrice: 1n,
  skipBalance: true,
})

console.log(res)
```

## See

 - [tevmContract](https://tevm.sh/reference/tevm/memory-client/functions/tevmContract)
 - [ContractParams](../../index/type-aliases/ContractParams.md)
 - [ContractResult](../../index/type-aliases/ContractResult.md)
