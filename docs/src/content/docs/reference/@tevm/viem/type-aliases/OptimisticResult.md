---
editUrl: false
next: false
prev: false
title: "OptimisticResult"
---

> **OptimisticResult**\<`TAbi`, `TFunctionName`, `TChain`\>: [`GenResult`](/reference/tevm/viem/type-aliases/genresult/)\<[`ContractResult`](/reference/tevm/actions-types/type-aliases/contractresult/)\<`TAbi`, `TFunctionName`\>, `"OPTIMISTIC_RESULT"`\> \| [`GenError`](/reference/tevm/viem/type-aliases/generror/)\<`Error`, `"OPTIMISTIC_RESULT"`\> \| [`GenResult`](/reference/tevm/viem/type-aliases/genresult/)\<`WriteContractReturnType`, `"HASH"`\> \| [`GenError`](/reference/tevm/viem/type-aliases/generror/)\<`WriteContractErrorType`, `"HASH"`\> \| [`GenResult`](/reference/tevm/viem/type-aliases/genresult/)\<`WaitForTransactionReceiptReturnType`\<`TChain`\>, `"RECEIPT"`\> \| [`GenError`](/reference/tevm/viem/type-aliases/generror/)\<`WriteContractErrorType`, `"RECEIPT"`\>

The result of an optimistic write

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

## Type parameters

| Parameter |
| :------ |
| `TAbi` extends `Abi` \| readonly `unknown`[] |
| `TFunctionName` extends `ContractFunctionName`\<`TAbi`\> |
| `TChain` extends `Chain` \| `undefined` |

## Source

[OptimisticResult.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/OptimisticResult.ts#L18)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
