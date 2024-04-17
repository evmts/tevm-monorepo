---
editUrl: false
next: false
prev: false
title: "ContractResult"
---

> **ContractResult**\<`TAbi`, `TFunctionName`, `ErrorType`\>: `Omit`\<[`CallResult`](/reference/tevm/actions-types/type-aliases/callresult/), `"errors"`\> & `object` \| [`CallResult`](/reference/tevm/actions-types/type-aliases/callresult/)\<`ErrorType`\> & `object`

## Type parameters

• **TAbi** extends [`Abi`](/reference/tevm/actions-types/type-aliases/abi/) \| readonly `unknown`[] = [`Abi`](/reference/tevm/actions-types/type-aliases/abi/)

• **TFunctionName** extends [`ContractFunctionName`](/reference/utils/type-aliases/contractfunctionname/)\<`TAbi`\> = [`ContractFunctionName`](/reference/utils/type-aliases/contractfunctionname/)\<`TAbi`\>

• **ErrorType** = [`ContractError`](/reference/errors/type-aliases/contracterror/)

## Source

[result/ContractResult.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/ContractResult.ts#L9)
