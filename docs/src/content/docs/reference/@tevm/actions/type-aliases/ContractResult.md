---
editUrl: false
next: false
prev: false
title: "ContractResult"
---

> **ContractResult**\<`TAbi`, `TFunctionName`, `ErrorType`\>: `Omit`\<[`CallResult`](/reference/tevm/actions/type-aliases/callresult/), `"errors"`\> & `object` \| [`CallResult`](/reference/tevm/actions/type-aliases/callresult/)\<`ErrorType`\> & `object`

## Type parameters

• **TAbi** *extends* [`Abi`](/reference/tevm/actions/type-aliases/abi/) \| readonly `unknown`[] = [`Abi`](/reference/tevm/actions/type-aliases/abi/)

• **TFunctionName** *extends* [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`TAbi`\> = [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`TAbi`\>

• **ErrorType** = [`TevmContractError`](/reference/tevm/actions/type-aliases/tevmcontracterror/)

## Source

[packages/actions/src/Contract/ContractResult.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Contract/ContractResult.ts#L6)
