---
editUrl: false
next: false
prev: false
title: "ContractHandler"
---

> **ContractHandler**: \<`TAbi`, `TFunctionName`\>(`action`) => `Promise`\<[`ContractResult`](/reference/tevm/actions/type-aliases/contractresult-1/)\<`TAbi`, `TFunctionName`\>\>

Handler for contract tevm procedure
It's API resuses the viem `contractRead`/`contractWrite` API to encode abi, functionName, and args

## Type parameters

• **TAbi** *extends* [`Abi`](/reference/tevm/utils/type-aliases/abi/) \| readonly `unknown`[] = [`Abi`](/reference/tevm/utils/type-aliases/abi/)

• **TFunctionName** *extends* [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`TAbi`\> = [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`TAbi`\>

## Parameters

• **action**: [`ContractParams`](/reference/tevm/actions/type-aliases/contractparams-1/)\<`TAbi`, `TFunctionName`\>

## Returns

`Promise`\<[`ContractResult`](/reference/tevm/actions/type-aliases/contractresult-1/)\<`TAbi`, `TFunctionName`\>\>

## Source

[packages/actions/src/Contract/ContractHandlerType.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Contract/ContractHandlerType.ts#L12)
