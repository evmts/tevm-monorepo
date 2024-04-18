**tevm** • [Readme](../../README.md) \| [API](../../modules.md)

***

[tevm](../../README.md) / [actions-types](../README.md) / ContractHandler

# Type alias: ContractHandler()

> **ContractHandler**: \<`TAbi`, `TFunctionName`\>(`action`) => `Promise`\<[`ContractResult`](../../index/type-aliases/ContractResult.md)\<`TAbi`, `TFunctionName`\>\>

Handler for contract tevm procedure
It's API resuses the viem `contractRead`/`contractWrite` API to encode abi, functionName, and args

## Type parameters

• **TAbi** extends [`Abi`](../../index/type-aliases/Abi.md) \| readonly `unknown`[] = [`Abi`](../../index/type-aliases/Abi.md)

• **TFunctionName** extends [`ContractFunctionName`](../../index/type-aliases/ContractFunctionName.md)\<`TAbi`\> = [`ContractFunctionName`](../../index/type-aliases/ContractFunctionName.md)\<`TAbi`\>

## Parameters

• **action**: [`ContractParams`](../../index/type-aliases/ContractParams.md)\<`TAbi`, `TFunctionName`\>

## Returns

`Promise`\<[`ContractResult`](../../index/type-aliases/ContractResult.md)\<`TAbi`, `TFunctionName`\>\>

## Source

packages/actions-types/types/handlers/ContractHandler.d.ts:8
