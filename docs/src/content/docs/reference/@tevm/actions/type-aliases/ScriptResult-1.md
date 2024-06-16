---
editUrl: false
next: false
prev: false
title: "ScriptResult"
---

> **ScriptResult**\<`TAbi`, `TFunctionName`, `TErrorType`\>: [`ContractResult`](/reference/tevm/actions/type-aliases/contractresult-1/)\<`TAbi`, `TFunctionName`, `TErrorType`\>

:::caution[Deprecated]
Can use `ContractResult` instead
:::

## Type parameters

• **TAbi** *extends* [`Abi`](/reference/tevm/actions/type-aliases/abi-1/) \| readonly `unknown`[] = [`Abi`](/reference/tevm/actions/type-aliases/abi-1/)

• **TFunctionName** *extends* [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`TAbi`\> = [`ContractFunctionName`](/reference/tevm/utils/type-aliases/contractfunctionname/)\<`TAbi`\>

• **TErrorType** = [`TevmScriptError`](/reference/tevm/actions/type-aliases/tevmscripterror-1/)

## Source

[packages/actions/src/Script/ScriptResult.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Script/ScriptResult.ts#L9)
