---
editUrl: false
next: false
prev: false
title: "GenError"
---

> **GenError**\<`TErrorType`, `TTag`\>: `object`

An error yield of writeContractOptimistic
Errors are yielded rather than throwing

## Type parameters

• **TErrorType**

• **TTag** extends `string`

## Type declaration

### error

> **error**: `TErrorType`

### errors?

> **`optional`** **errors**: `ReadonlyArray`\<[`TypedError`](/reference/tevm/viem/type-aliases/typederror/)\<`string`\>\>

### success

> **success**: `false`

### tag

> **tag**: `TTag`

## Source

[GenError.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenError.ts#L7)
