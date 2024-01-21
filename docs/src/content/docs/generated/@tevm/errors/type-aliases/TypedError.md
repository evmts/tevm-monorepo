---
editUrl: false
next: false
prev: false
title: "TypedError"
---

> **TypedError**\<`TName`, `TMeta`\>: `object`

Internal utility for creating a typed error as typed by Tevm
`name` is analogous to `code` in a JSON RPC error and is the value used to discriminate errors
for tevm users.
`_tag` is same as name and used internally so it can be changed in non breaking way with regard to name
`message` is a human readable error message
`meta` is an optional object containing additional information about the error

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `TName` extends `string` | - |
| `TMeta` | `never` |

## Type declaration

### \_tag

> **\_tag**: `TName`

### message

> **message**: `string`

### meta

> **meta**?: `TMeta`

### name

> **name**: `TName`

## Source

[packages/errors/src/TypedError.ts:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/TypedError.ts#L9)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
