---
editUrl: false
next: false
prev: false
title: "ScriptParams"
---

> **ScriptParams**\<`TAbi`, `TFunctionName`, `TThrowOnFail`\>: [`EncodeFunctionDataParameters`](/reference/tevm/utils/type-aliases/encodefunctiondataparameters/)\<`TAbi`, `TFunctionName`\> & [`BaseCallParams`](/reference/tevm/actions/type-aliases/basecallparams/)\<`TThrowOnFail`\> & `object`

:::caution[Deprecated]
Can use `ContraactParams` instead
Tevm params for deploying and running a script
:::

## Type declaration

### ~~deployedBytecode~~

> `readonly` **deployedBytecode**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)

The EVM code to run.

## Type Parameters

• **TAbi** *extends* [`Abi`](/reference/tevm/utils/type-aliases/abi/) \| readonly `unknown`[] = [`Abi`](/reference/tevm/utils/type-aliases/abi/)

• **TFunctionName** *extends* [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`TAbi`\> = [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`TAbi`\>

• **TThrowOnFail** *extends* `boolean` = `boolean`

## Defined in

[packages/actions/src/Script/ScriptParams.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Script/ScriptParams.ts#L9)
