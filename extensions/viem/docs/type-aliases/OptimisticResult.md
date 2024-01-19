**@tevm/viem** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > OptimisticResult

# Type alias: OptimisticResult`<TAbi, TFunctionName, TChain>`

> **OptimisticResult**\<`TAbi`, `TFunctionName`, `TChain`\>: [`GenResult`](GenResult.md)\<`ContractResult`\<`TAbi`, `TFunctionName`\>, `"OPTIMISTIC_RESULT"`\> \| [`GenError`](GenError.md)\<`Error`, `"OPTIMISTIC_RESULT"`\> \| [`GenResult`](GenResult.md)\<`WriteContractReturnType`, `"HASH"`\> \| [`GenError`](GenError.md)\<`WriteContractErrorType`, `"HASH"`\> \| [`GenResult`](GenResult.md)\<`WaitForTransactionReceiptReturnType`\<`TChain`\>, `"RECEIPT"`\> \| [`GenError`](GenError.md)\<`WriteContractErrorType`, `"RECEIPT"`\>

## Type parameters

| Parameter |
| :------ |
| `TAbi` extends `Abi` \| readonly `unknown`[] |
| `TFunctionName` extends `ContractFunctionName`\<`TAbi`\> |
| `TChain` extends `Chain` \| `undefined` |

## Source

[OptimisticResult.ts:13](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/OptimisticResult.ts#L13)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
