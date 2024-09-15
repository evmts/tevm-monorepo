---
editUrl: false
next: false
prev: false
title: "ScriptResult"
---

> **ScriptResult**\<`TAbi`, `TFunctionName`, `TErrorType`\>: [`ContractResult`](/reference/tevm/actions/type-aliases/contractresult/)\<`TAbi`, `TFunctionName`, `TErrorType`\>

:::caution[Deprecated]
Can use `ContractResult` instead
:::

## Type Parameters

• **TAbi** *extends* [`Abi`](/reference/tevm/actions/type-aliases/abi/) \| readonly `unknown`[] = [`Abi`](/reference/tevm/actions/type-aliases/abi/)

• **TFunctionName** *extends* [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`TAbi`\> = [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`TAbi`\>

• **TErrorType** = [`TevmScriptError`](/reference/tevm/actions/type-aliases/tevmscripterror/)

## Defined in

[packages/actions/src/Script/ScriptResult.ts:9](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/actions/src/Script/ScriptResult.ts#L9)
