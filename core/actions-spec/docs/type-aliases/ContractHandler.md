**@tevm/api** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > ContractHandler

# Type alias: ContractHandler

> **ContractHandler**: \<`TAbi`, `TFunctionName`\>(`action`) => `Promise`\<[`ContractResult`](ContractResult.md)\<`TAbi`, `TFunctionName`\>\>

Handler for contract tevm procedure
It's API resuses the viem `contractRead`/`contractWrite` API to encode abi, functionName, and args

## Type parameters

▪ **TAbi** extends `Abi` \| readonly `unknown`[] = `Abi`

▪ **TFunctionName** extends `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\>

## Parameters

▪ **action**: [`ContractParams`](ContractParams.md)\<`TAbi`, `TFunctionName`\>

## Source

[handlers/ContractHandler.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/ContractHandler.ts#L11)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
