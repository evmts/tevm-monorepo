[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / zBlock

# Variable: zBlock

> `const` **zBlock**: `z.ZodObject`\<\{ `baseFeePerGas`: `z.ZodOptional`\<`z.ZodBigInt`\>; `blobGasPrice`: `z.ZodOptional`\<`z.ZodBigInt`\>; `coinbase`: `z.ZodType`\<`any`, `z.ZodTypeDef`, `any`\>; `difficulty`: `z.ZodBigInt`; `gasLimit`: `z.ZodBigInt`; `number`: `z.ZodBigInt`; `timestamp`: `z.ZodBigInt`; \}, `"strict"`, `z.ZodTypeAny`, \{ `baseFeePerGas`: `bigint`; `blobGasPrice`: `bigint`; `coinbase`: `any`; `difficulty`: `bigint`; `gasLimit`: `bigint`; `number`: `bigint`; `timestamp`: `bigint`; \}, \{ `baseFeePerGas`: `bigint`; `blobGasPrice`: `bigint`; `coinbase`: `any`; `difficulty`: `bigint`; `gasLimit`: `bigint`; `number`: `bigint`; `timestamp`: `bigint`; \}\>

Defined in: packages/actions/dist/index.d.ts:4300

Zod validator for a block header specification within actions
