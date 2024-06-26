[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / ContractHandler

# Type Alias: ContractHandler()

> **ContractHandler**: \<`TAbi`, `TFunctionName`\>(`action`) => `Promise`\<[`ContractResult`](ContractResult.md)\<`TAbi`, `TFunctionName`\>\>

Handler for contract tevm procedure
It's API resuses the viem `contractRead`/`contractWrite` API to encode abi, functionName, and args

## Type Parameters

• **TAbi** *extends* `Abi` \| readonly `unknown`[] = `Abi`

• **TFunctionName** *extends* `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\>

## Parameters

• **action**: [`ContractParams`](ContractParams.md)\<`TAbi`, `TFunctionName`\>

## Returns

`Promise`\<[`ContractResult`](ContractResult.md)\<`TAbi`, `TFunctionName`\>\>

## Defined in

[packages/actions/src/Contract/ContractHandlerType.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Contract/ContractHandlerType.ts#L12)
