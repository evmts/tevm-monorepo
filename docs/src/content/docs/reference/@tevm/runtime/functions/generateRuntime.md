---
editUrl: false
next: false
prev: false
title: "generateRuntime"
---

> **generateRuntime**(`artifacts`, `moduleType`, `includeBytecode`, `tevmPackage`): `Effect`\<`string`, `never`, `never`\>

## Parameters

• **artifacts**: [`Artifacts`](/reference/tevm/compiler/types/type-aliases/artifacts/)

• **moduleType**: [`ModuleType`](/reference/tevm/runtime/type-aliases/moduletype/)

• **includeBytecode**: `boolean`

• **tevmPackage**: `"tevm/contract"` \| `"@tevm/contract"`

Package to import contracts from

## Returns

`Effect`\<`string`, `never`, `never`\>

## Defined in

[generateRuntime.js:28](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/runtime/src/generateRuntime.js#L28)
