[**@tevm/viem**](../README.md) • **Docs**

***

[@tevm/viem](../globals.md) / OptimisticResult

# Type alias: OptimisticResult\<TAbi, TFunctionName, TChain\>

`Experimental`

> **OptimisticResult**\<`TAbi`, `TFunctionName`, `TChain`\>: [`GenResult`](GenResult.md)\<`ContractResult`\<`TAbi`, `TFunctionName`\>, `"OPTIMISTIC_RESULT"`\> \| [`GenError`](GenError.md)\<`Error`, `"OPTIMISTIC_RESULT"`\> \| [`GenResult`](GenResult.md)\<`WriteContractReturnType`, `"HASH"`\> \| [`GenError`](GenError.md)\<`WriteContractErrorType`, `"HASH"`\> \| [`GenResult`](GenResult.md)\<`WaitForTransactionReceiptReturnType`\<`TChain`\>, `"RECEIPT"`\> \| [`GenError`](GenError.md)\<`WriteContractErrorType`, `"RECEIPT"`\>

The result of an optimistic write

## Type parameters

• **TAbi** *extends* `Abi` \| readonly `unknown`[]

• **TFunctionName** *extends* `ContractFunctionName`\<`TAbi`\>

• **TChain** *extends* `Chain` \| `undefined`

## Source

[extensions/viem/src/OptimisticResult.ts:17](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/OptimisticResult.ts#L17)
