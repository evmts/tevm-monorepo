[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / createError

# Function: createError()

> **createError**\<`T`\>(`name`, `message`, `input`?): `object`

## Type Parameters

• **T** *extends* `string`

## Parameters

• **name**: `T`

• **message**: `string`

• **input?**: `string`

## Returns

`object`

### \_tag

> **\_tag**: `T` = `name`

### code

> **code**: `number` = `-32700`

### input

> **input**: `undefined` \| `string`

### message

> **message**: `string`

### name

> **name**: `T`

## Defined in

[packages/actions/src/internal/zod/createError.js:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/internal/zod/createError.js#L7)
