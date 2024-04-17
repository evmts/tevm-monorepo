**@tevm/zod** • [Readme](../README.md) \| [API](../globals.md)

***

[@tevm/zod](../README.md) / zBlock

# Variable: zBlock

> **`const`** **zBlock**: `ZodObject`\<`object`, `"strict"`, `ZodTypeAny`, `object`, `object`\>

Zod validator for a block header specification within actions

## Type declaration

### baseFeePerGas

> **baseFeePerGas**: `ZodOptional`\<`ZodBigInt`\>

### blobGasPrice

> **blobGasPrice**: `ZodOptional`\<`ZodBigInt`\>

### coinbase

> **coinbase**: `ZodEffects`\<`ZodString`, ```0x${string}```, `string`\>

### difficulty

> **difficulty**: `ZodBigInt`

### gasLimit

> **gasLimit**: `ZodBigInt`

### number

> **number**: `ZodBigInt`

### timestamp

> **timestamp**: `ZodBigInt`

## Source

[packages/zod/src/common/zBlock.js:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/zod/src/common/zBlock.js#L7)
