---
editUrl: false
next: false
prev: false
title: "ScriptHandler"
---

> **ScriptHandler**: \<`TAbi`, `TFunctionName`\>(`params`) => `Promise`\<[`ScriptResult`](/generated/type-aliases/scriptresult/)\<`TAbi`, `TFunctionName`\>\>

Handler for script tevm procedure

## Type parameters

▪ **TAbi** extends `Abi` \| readonly `unknown`[] = `Abi`

▪ **TFunctionName** extends `ContractFunctionName`\<`TAbi`\> = `ContractFunctionName`\<`TAbi`\>

## Parameters

▪ **params**: [`ScriptParams`](/generated/type-aliases/scriptparams/)\<`TAbi`, `TFunctionName`\>

## Source

[handlers/ScriptHandler.ts:8](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/handlers/ScriptHandler.ts#L8)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
