[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / ContractHandler

# Type Alias: ContractHandler()

> **ContractHandler**: \<`TAbi`, `TFunctionName`\>(`action`) => `Promise`\<[`ContractResult`](ContractResult.md)\<`TAbi`, `TFunctionName`\>\>

Handler for executing contract interactions with the TEVM.

This handler is adapted from viem and is designed to closely match the viem `contractRead`/`contractWrite` API.
It encodes the ABI, function name, and arguments to perform the contract call.

## Type Parameters

• **TAbi** *extends* `Abi` \| readonly `unknown`[] = `Abi`

The ABI type.

• **TFunctionName** *extends* `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\>

The function name type from the ABI.

## Parameters

• **action**: [`ContractParams`](ContractParams.md)\<`TAbi`, `TFunctionName`\>

The parameters for the contract call, including ABI, function name, and arguments.

## Returns

`Promise`\<[`ContractResult`](ContractResult.md)\<`TAbi`, `TFunctionName`\>\>

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
 - [ContractParams](ContractParams.md)
 - [ContractResult](ContractResult.md)

## Defined in

[packages/actions/src/Contract/ContractHandlerType.ts:45](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Contract/ContractHandlerType.ts#L45)
