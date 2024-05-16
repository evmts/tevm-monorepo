---
editUrl: false
next: false
prev: false
title: "zJsonRpcRequest"
---

> `const` **zJsonRpcRequest**: `ZodObject`\<`object`, `"strict"`, `ZodTypeAny`, `object`, `object`\>

Zod validator for a valid JsonRpcRequest

## Type declaration

### id

> **id**: `ZodOptional`\<`ZodUnion`\<[`ZodString`, `ZodNumber`, `ZodNull`]\>\>

### jsonrpc

> **jsonrpc**: `ZodLiteral`\<`"2.0"`\>

### method

> **method**: `ZodString`

### params

> **params**: `ZodOptional`\<`ZodUnion`\<[`ZodRecord`\<`ZodString`, `ZodAny`\>, `ZodArray`\<`ZodAny`, `"many"`\>]\>\>

## Source

[packages/zod/src/common/zJsonRpcRequest.js:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/zod/src/common/zJsonRpcRequest.js#L6)
