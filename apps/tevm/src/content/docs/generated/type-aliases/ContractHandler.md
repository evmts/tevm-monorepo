---
editUrl: false
next: false
prev: false
title: "ContractHandler"
---

> **ContractHandler**: \<`TAbi`, `TFunctionName`\>(`action`) => `Promise`\<[`ContractResult`](/generated/type-aliases/contractresult/)\<`TAbi`, `TFunctionName`\>\>

Handler for contract tevm procedure
It's API resuses the viem `contractRead`/`contractWrite` API to encode abi, functionName, and args

## Type parameters

▪ **TAbi** extends `Abi` \| readonly `unknown`[] = `Abi`

▪ **TFunctionName** extends `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\>

## Parameters

▪ **action**: [`ContractParams`](/generated/type-aliases/contractparams/)\<`TAbi`, `TFunctionName`\>

## Source

[handlers/ContractHandler.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/ContractHandler.ts#L9)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
