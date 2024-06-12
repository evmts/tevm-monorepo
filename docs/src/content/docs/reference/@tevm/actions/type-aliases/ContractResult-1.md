---
editUrl: false
next: false
prev: false
title: "ContractResult"
---

> **ContractResult**\<`TAbi`, `TFunctionName`, `ErrorType`\>: `Omit`\<[`CallResult`](/reference/tevm/actions/type-aliases/callresult-1/), `"errors"`\> & `object` \| [`CallResult`](/reference/tevm/actions/type-aliases/callresult-1/)\<`ErrorType`\> & `object`

## Type parameters

• **TAbi** *extends* [`Abi`](/reference/tevm/actions/type-aliases/abi-1/) \| readonly `unknown`[] = [`Abi`](/reference/tevm/actions/type-aliases/abi-1/)

• **TFunctionName** *extends* [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`TAbi`\> = [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`TAbi`\>

• **ErrorType** = [`TevmContractError`](/reference/tevm/actions/type-aliases/tevmcontracterror-1/)

## Source

[packages/actions/src/Contract/ContractResult.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Contract/ContractResult.ts#L6)
