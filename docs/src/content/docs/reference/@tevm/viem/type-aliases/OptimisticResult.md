---
editUrl: false
next: false
prev: false
title: "OptimisticResult"
---

> **OptimisticResult**\<`TAbi`, `TFunctionName`, `TChain`\>: [`GenResult`](/reference/tevm/viem/type-aliases/genresult/)\<[`ContractResult`](/reference/tevm/actions/type-aliases/contractresult/)\<`TAbi`, `TFunctionName`\>, `"OPTIMISTIC_RESULT"`\> \| [`GenError`](/reference/tevm/viem/type-aliases/generror/)\<`Error`, `"OPTIMISTIC_RESULT"`\> \| [`GenResult`](/reference/tevm/viem/type-aliases/genresult/)\<`WriteContractReturnType`, `"HASH"`\> \| [`GenError`](/reference/tevm/viem/type-aliases/generror/)\<`WriteContractErrorType`, `"HASH"`\> \| [`GenResult`](/reference/tevm/viem/type-aliases/genresult/)\<`WaitForTransactionReceiptReturnType`\<`TChain`\>, `"RECEIPT"`\> \| [`GenError`](/reference/tevm/viem/type-aliases/generror/)\<`WriteContractErrorType`, `"RECEIPT"`\>

The result of an optimistic write

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

## Type Parameters

• **TAbi** *extends* [`Abi`](/reference/tevm/utils/type-aliases/abi/) \| readonly `unknown`[]

• **TFunctionName** *extends* [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`TAbi`\>

• **TChain** *extends* `Chain` \| `undefined`

## Defined in

[extensions/viem/src/OptimisticResult.ts:17](https://github.com/qbzzt/tevm-monorepo/blob/main/extensions/viem/src/OptimisticResult.ts#L17)
