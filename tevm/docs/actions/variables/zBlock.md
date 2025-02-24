[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [actions](../README.md) / zBlock

# Variable: zBlock

> `const` **zBlock**: `z.ZodObject`\<`object`, `"strict"`, `z.ZodTypeAny`, `object`, `object`\>

Zod validator for a block header specification within actions

## Type declaration

### baseFeePerGas

> **baseFeePerGas**: `z.ZodOptional`\<`z.ZodBigInt`\>

### blobGasPrice

> **blobGasPrice**: `z.ZodOptional`\<`z.ZodBigInt`\>

### coinbase

> **coinbase**: `z.ZodEffects`\<`z.ZodString`, \`0x$\{string\}\`, `string`\>

### difficulty

> **difficulty**: `z.ZodBigInt`

### gasLimit

> **gasLimit**: `z.ZodBigInt`

### number

> **number**: `z.ZodBigInt`

### timestamp

> **timestamp**: `z.ZodBigInt`

## Defined in

packages/actions/types/internal/zod/zBlock.d.ts:4
