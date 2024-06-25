[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / zJsonRpcRequest

# Variable: zJsonRpcRequest

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

## Defined in

[packages/actions/src/internal/zod/zJsonRpcRequest.js:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/internal/zod/zJsonRpcRequest.js#L6)
