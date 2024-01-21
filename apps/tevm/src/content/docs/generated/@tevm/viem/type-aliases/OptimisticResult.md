---
editUrl: false
next: false
prev: false
title: "OptimisticResult"
---

> **OptimisticResult**\<`TAbi`, `TFunctionName`, `TChain`\>: [`GenResult`](/generated/tevm/viem/type-aliases/genresult/)\<[`ContractResult`](/generated/tevm/actions-types/type-aliases/contractresult/)\<`TAbi`, `TFunctionName`\>, `"OPTIMISTIC_RESULT"`\> \| [`GenError`](/generated/tevm/viem/type-aliases/generror/)\<`Error`, `"OPTIMISTIC_RESULT"`\> \| [`GenResult`](/generated/tevm/viem/type-aliases/genresult/)\<`WriteContractReturnType`, `"HASH"`\> \| [`GenError`](/generated/tevm/viem/type-aliases/generror/)\<`WriteContractErrorType`, `"HASH"`\> \| [`GenResult`](/generated/tevm/viem/type-aliases/genresult/)\<`WaitForTransactionReceiptReturnType`\<`TChain`\>, `"RECEIPT"`\> \| [`GenError`](/generated/tevm/viem/type-aliases/generror/)\<`WriteContractErrorType`, `"RECEIPT"`\>

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
