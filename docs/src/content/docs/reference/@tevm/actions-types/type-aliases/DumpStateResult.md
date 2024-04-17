---
editUrl: false
next: false
prev: false
title: "DumpStateResult"
---

> **DumpStateResult**\<`ErrorType`\>: `object`

Result of the dumpState method

## Type parameters

• **ErrorType** = [`DumpStateError`](/reference/errors/type-aliases/dumpstateerror/)

## Type declaration

### errors?

> **`optional`** **errors**: `ErrorType`[]

Description of the exception, if any occurred

### state

> **state**: [`TevmState`](/reference/state/type-aliases/tevmstate/)

The serialized tevm state

## Source

[result/DumpStateResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions-types/src/result/DumpStateResult.ts#L7)
