---
editUrl: false
next: false
prev: false
title: "ScriptParams"
---

> **ScriptParams**\<`TAbi`, `TFunctionName`, `TThrowOnFail`\>: [`EncodeFunctionDataParameters`](/reference/utils/type-aliases/encodefunctiondataparameters/)\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](/reference/tevm/actions-types/type-aliases/basecallparams/)\<`TThrowOnFail`\> & `object`

Tevm params for deploying and running a script

## Type declaration

### deployedBytecode

> **deployedBytecode**: [`Hex`](/reference/utils/type-aliases/hex/)

The EVM code to run.

## Type parameters

• **TAbi** extends [`Abi`](/reference/utils/type-aliases/abi/) \| readonly `unknown`[] = [`Abi`](/reference/utils/type-aliases/abi/)

• **TFunctionName** extends [`ContractFunctionName`](/reference/utils/type-aliases/contractfunctionname/)\<`TAbi`\> = [`ContractFunctionName`](/reference/utils/type-aliases/contractfunctionname/)\<`TAbi`\>

• **TThrowOnFail** extends `boolean` = `boolean`

## Source

[params/ScriptParams.ts:12](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/params/ScriptParams.ts#L12)
