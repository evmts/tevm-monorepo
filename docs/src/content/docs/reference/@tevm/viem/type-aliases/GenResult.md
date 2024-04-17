---
editUrl: false
next: false
prev: false
title: "GenResult"
---

`Experimental`

> **GenResult**\<`TDataType`, `TTag`\>: `object`

A result type for a single yield of writeContractOptimistic

:::caution[Experimental]
This API should not be used in production and may be trimmed from a public release.
:::

## Type parameters

• **TDataType**

• **TTag** extends `string`

## Type declaration

### data

> **data**: `TDataType`

### errors?

> **`optional`** **errors**: `ReadonlyArray`\<[`TypedError`](/reference/tevm/viem/type-aliases/typederror/)\<`string`\>\>

### success

> **success**: `true`

### tag

> **tag**: `TTag`

## Source

[GenResult.ts:7](https://github.com/evmts/tevm-monorepo/blob/main/extensions/viem/src/GenResult.ts#L7)
