---
editUrl: false
next: false
prev: false
title: "ScriptResult"
---

> **ScriptResult**\<`TAbi`, `TFunctionName`, `TErrorType`\>: [`ContractResult`](/reference/tevm/actions-types/type-aliases/contractresult/)\<`TAbi`, `TFunctionName`, `TErrorType`\>

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TAbi` extends [`Abi`](/reference/tevm/actions-types/type-aliases/abi/) \| readonly `unknown`[] | [`Abi`](/reference/tevm/actions-types/type-aliases/abi/) |
| `TFunctionName` extends `ContractFunctionName`\<`TAbi`\> | `ContractFunctionName`\<`TAbi`\> |
| `TErrorType` | [`ScriptError`](/reference/tevm/errors/type-aliases/scripterror/) |

## Source

[result/ScriptResult.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/ScriptResult.ts#L6)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
