---
editUrl: false
next: false
prev: false
title: "DumpStateResult"
---

> **DumpStateResult**\<`ErrorType`\>: `object`

Result of Account Action

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `ErrorType` | [`DumpStateError`](/generated/tevm/api/type-aliases/dumpstateerror/) |

## Type declaration

### errors

> **errors**?: `ErrorType`[]

Description of the exception, if any occurred

### state

> **state**: [`SerializableTevmState`](/generated/tevm/state/type-aliases/serializabletevmstate/)

The serialized tevm state

## Source

[result/DumpStateResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/vm/api/src/result/DumpStateResult.ts#L7)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
