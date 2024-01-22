---
editUrl: false
next: false
prev: false
title: "DumpStateResult"
---

> **DumpStateResult**\<`ErrorType`\>: `object`

Result of the dumpState method

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `ErrorType` | [`DumpStateError`](/reference/tevm/errors/type-aliases/dumpstateerror/) |

## Type declaration

### errors

> **errors**?: `ErrorType`[]

Description of the exception, if any occurred

### state

> **state**: `SerializableTevmState`

The serialized tevm state

## Source

[result/DumpStateResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/DumpStateResult.ts#L7)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
