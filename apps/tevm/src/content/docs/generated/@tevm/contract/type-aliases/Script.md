---
editUrl: false
next: false
prev: false
title: "Script"
---

> **Script**\<`TName`, `THumanReadableAbi`\>: `object`

## Type parameters

| Parameter |
| :------ |
| `TName` extends `string` |
| `THumanReadableAbi` extends `ReadonlyArray`\<`string`\> |

## Type declaration

### abi

> **abi**: `ParseAbi`\<`THumanReadableAbi`\>

### bytecode

> **bytecode**: `Hex`

### deployedBytecode

> **deployedBytecode**: `Hex`

### events

> **events**: [`Events`](/generated/tevm/contract/type-aliases/events/)\<`THumanReadableAbi`, `Hex`, `Hex`, `undefined`\>

### humanReadableAbi

> **humanReadableAbi**: `THumanReadableAbi`

### name

> **name**: `TName`

### read

> **read**: [`Read`](/generated/tevm/contract/type-aliases/read/)\<`THumanReadableAbi`, `Hex`, `Hex`, `undefined`\>

### withAddress

> **withAddress**: \<`TAddress`\>(`address`) => [`Script`](/generated/tevm/contract/type-aliases/script/)\<`TName`, `THumanReadableAbi`\> & `object`

#### Type parameters

▪ **TAddress** extends `Address`

#### Parameters

▪ **address**: `TAddress`

### write

> **write**: [`Write`](/generated/tevm/contract/type-aliases/write/)\<`THumanReadableAbi`, `Hex`, `Hex`, `undefined`\>

## Source

[packages/contract/src/Script.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/Script.ts#L7)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
