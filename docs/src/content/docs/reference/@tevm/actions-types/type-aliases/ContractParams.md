---
editUrl: false
next: false
prev: false
title: "ContractParams"
---

> **ContractParams**\<`TAbi`, `TFunctionName`, `TThrowOnFail`\>: [`EncodeFunctionDataParameters`](/reference/tevm/utils/type-aliases/encodefunctiondataparameters/)\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](/reference/tevm/actions-types/type-aliases/basecallparams/)\<`TThrowOnFail`\> & `object`

Tevm params to execute a call on a contract

## Type declaration

### to

> `readonly` **to**: [`Address`](/reference/tevm/actions-types/type-aliases/address/)

The address to call.

## Type parameters

• **TAbi** *extends* [`Abi`](/reference/tevm/actions-types/type-aliases/abi/) \| readonly `unknown`[] = [`Abi`](/reference/tevm/actions-types/type-aliases/abi/)

• **TFunctionName** *extends* [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`TAbi`\> = [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`TAbi`\>

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Source

[params/ContractParams.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/ContractParams.ts#L8)
