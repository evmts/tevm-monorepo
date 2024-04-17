**@tevm/zod** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/zod](../README.md) / zGetAccountParams

# Variable: zGetAccountParams

> **`const`** **zGetAccountParams**: `ZodObject`\<`object`, `"strip"`, `ZodTypeAny`, `object`, `object`\>

Zod validator for a valid getAccount action

## Type declaration

### address

> **address**: `ZodEffects`\<`ZodString`, ```0x${string}```, `string`\> = `zAddress`

### returnStorage

> **returnStorage**: `ZodOptional`\<`ZodBoolean`\>

### throwOnFail

> **throwOnFail**: `ZodOptional`\<`ZodBoolean`\>

## Source

[packages/zod/src/params/zGetAccountParams.js:8](https://github.com/evmts/tevm-monorepo/blob/main/packages/zod/src/params/zGetAccountParams.js#L8)
