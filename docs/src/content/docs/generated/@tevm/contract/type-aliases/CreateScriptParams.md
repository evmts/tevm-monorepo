---
editUrl: false
next: false
prev: false
title: "CreateScriptParams"
---

> **CreateScriptParams**\<`TName`, `THumanReadableAbi`\>: `Pick`\<[`Script`](/generated/tevm/contract/type-aliases/script/)\<`TName`, `THumanReadableAbi`\>, `"name"` \| `"humanReadableAbi"` \| `"bytecode"` \| `"deployedBytecode"`\>

Params for creating a [Script](/generated/tevm/contract/type-aliases/script/) instance

## See

[CreateScript](CreateScript.md)

## Type parameters

| Parameter |
| :------ |
| `TName` extends `string` |
| `THumanReadableAbi` extends readonly `string`[] |

## Source

[packages/contract/src/types.ts:56](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/types.ts#L56)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
