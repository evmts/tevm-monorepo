[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / zBlock

# Variable: zBlock

> `const` **zBlock**: `z.ZodObject`\<\{ `baseFeePerGas`: `z.ZodOptional`\<`z.ZodBigInt`\>; `blobGasPrice`: `z.ZodOptional`\<`z.ZodBigInt`\>; `coinbase`: `z.ZodEffects`\<`z.ZodString`, `` `0x${string}` ``, `string`\>; `difficulty`: `z.ZodBigInt`; `gasLimit`: `z.ZodBigInt`; `number`: `z.ZodBigInt`; `timestamp`: `z.ZodBigInt`; \}, `"strict"`, `z.ZodTypeAny`, \{ `baseFeePerGas`: `bigint`; `blobGasPrice`: `bigint`; `coinbase`: `` `0x${string}` ``; `difficulty`: `bigint`; `gasLimit`: `bigint`; `number`: `bigint`; `timestamp`: `bigint`; \}, \{ `baseFeePerGas`: `bigint`; `blobGasPrice`: `bigint`; `coinbase`: `string`; `difficulty`: `bigint`; `gasLimit`: `bigint`; `number`: `bigint`; `timestamp`: `bigint`; \}\>

Defined in: packages/actions/types/internal/zod/zBlock.d.ts:4

Zod validator for a block header specification within actions
