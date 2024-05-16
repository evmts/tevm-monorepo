[**@tevm/runtime**](../README.md) • **Docs**

***

[@tevm/runtime](../globals.md) / generateRuntime

# Function: generateRuntime()

> **generateRuntime**(`artifacts`, `moduleType`, `includeBytecode`, `tevmPackage`): `Effect`\<`never`, `never`, `string`\>

## Parameters

• **artifacts**: `Artifacts`

• **moduleType**: [`ModuleType`](../type-aliases/ModuleType.md)

• **includeBytecode**: `boolean`

• **tevmPackage**: `"tevm/contract"` \| `"@tevm/contract"`

Package to import contracts from

## Returns

`Effect`\<`never`, `never`, `string`\>

## Source

[generateRuntime.js:28](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/runtime/src/generateRuntime.js#L28)
