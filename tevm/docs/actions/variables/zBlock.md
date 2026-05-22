[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / zBlock

# Variable: zBlock

> `const` **zBlock**: `z.ZodObject`\<\{ `baseFeePerGas`: `z.ZodOptional`\<`z.ZodBigInt`\>; `blobGasPrice`: `z.ZodOptional`\<`z.ZodBigInt`\>; `coinbase`: `z.ZodPipe`\<`z.ZodString`, `z.ZodTransform`\<`string`, `string`\>\>; `difficulty`: `z.ZodBigInt`; `gasLimit`: `z.ZodBigInt`; `number`: `z.ZodBigInt`; `timestamp`: `z.ZodBigInt`; \}, `z.core.$strict`\>

Zod validator for a block header specification within actions
