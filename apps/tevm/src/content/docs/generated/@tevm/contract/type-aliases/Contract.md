---
editUrl: false
next: false
prev: false
title: "Contract"
---

> **Contract**\<`TName`, `THumanReadableAbi`\>: `object`

## Type parameters

| Parameter |
| :------ |
| `TName` extends `string` |
| `THumanReadableAbi` extends `ReadonlyArray`\<`string`\> |

## Type declaration

### abi

> **abi**: `ParseAbi`\<`THumanReadableAbi`\>

### bytecode

> **bytecode**?: `undefined`

### deployedBytecode

> **deployedBytecode**?: `undefined`

### events

> **events**: [`Events`](/generated/tevm/contract/type-aliases/events/)\<`THumanReadableAbi`, `undefined`, `undefined`, `undefined`\>

### humanReadableAbi

> **humanReadableAbi**: `THumanReadableAbi`

### name

> **name**: `TName`

### read

> **read**: [`Read`](/generated/tevm/contract/type-aliases/read/)\<`THumanReadableAbi`, `undefined`, `undefined`, `undefined`\>

### withAddress

> **withAddress**: \<`TAddress`\>(`address`) => `Omit`\<[`Contract`](/generated/tevm/contract/type-aliases/contract/)\<`TName`, `THumanReadableAbi`\>, `"read"` \| `"write"` \| `"events"`\> & `object`

#### Type parameters

▪ **TAddress** extends `Address`

#### Parameters

▪ **address**: `TAddress`

### write

> **write**: [`Write`](/generated/tevm/contract/type-aliases/write/)\<`THumanReadableAbi`, `undefined`, `undefined`, `undefined`\>

## Source

[packages/contract/src/Contract.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/Contract.ts#L6)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
