---
editUrl: false
next: false
prev: false
title: "ContractHandler"
---

> **ContractHandler**: \<`TAbi`, `TFunctionName`\>(`action`) => `Promise`\<[`ContractResult`](/reference/tevm/actions-types/type-aliases/contractresult/)\<`TAbi`, `TFunctionName`\>\>

Handler for contract tevm procedure
It's API resuses the viem `contractRead`/`contractWrite` API to encode abi, functionName, and args

## Type parameters

▪ **TAbi** extends `Abi` \| readonly `unknown`[] = `Abi`

▪ **TFunctionName** extends `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\>

## Parameters

▪ **action**: [`ContractParams`](/reference/tevm/actions-types/type-aliases/contractparams/)\<`TAbi`, `TFunctionName`\>

## Source

[handlers/ContractHandler.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/handlers/ContractHandler.ts#L11)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
