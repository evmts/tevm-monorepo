[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / zBlock

# Variable: zBlock

> `const` **zBlock**: `ZodObject`\<`object`, `"strict"`, `ZodTypeAny`, `object`, `object`\>

Zod validator for a block header specification within actions

## Type declaration

### baseFeePerGas

> **baseFeePerGas**: `ZodOptional`\<`ZodBigInt`\>

### blobGasPrice

> **blobGasPrice**: `ZodOptional`\<`ZodBigInt`\>

### coinbase

> **coinbase**: `ZodEffects`\<`ZodString`, \`0x$\{string\}\`, `string`\>

### difficulty

> **difficulty**: `ZodBigInt`

### gasLimit

> **gasLimit**: `ZodBigInt`

### number

> **number**: `ZodBigInt`

### timestamp

> **timestamp**: `ZodBigInt`

## Defined in

[packages/actions/src/internal/zod/zBlock.js:7](https://github.com/qbzzt/tevm-monorepo/blob/main/packages/actions/src/internal/zod/zBlock.js#L7)
