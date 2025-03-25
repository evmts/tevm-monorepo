[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / zLoadStateParams

# Variable: zLoadStateParams

> `const` **zLoadStateParams**: `z.ZodObject`\<\{ `state`: `z.ZodRecord`\<`z.ZodString`, `z.ZodObject`\<`z.objectUtil.extendShape`\<\{ `throwOnFail`: `z.ZodOptional`\<`z.ZodBoolean`\>; \}, \{ `balance`: `z.ZodBigInt`; `codeHash`: `any`; `nonce`: `z.ZodBigInt`; `storage`: `z.ZodOptional`\<`z.ZodRecord`\<`z.ZodString`, `any`\>\>; `storageRoot`: `any`; \}\>, `"strip"`, `z.ZodTypeAny`, \{ `balance`: `bigint`; `codeHash`: `any`; `nonce`: `bigint`; `storage`: `Record`\<`string`, `any`\>; `storageRoot`: `any`; `throwOnFail`: `boolean`; \}, \{ `balance`: `bigint`; `codeHash`: `any`; `nonce`: `bigint`; `storage`: `Record`\<`string`, `any`\>; `storageRoot`: `any`; `throwOnFail`: `boolean`; \}\>\>; \}, `"strip"`, `z.ZodTypeAny`, \{ `state`: `Record`\<`string`, \{ `balance`: `bigint`; `codeHash`: `any`; `nonce`: `bigint`; `storage`: `Record`\<`string`, `any`\>; `storageRoot`: `any`; `throwOnFail`: `boolean`; \}\>; \}, \{ `state`: `Record`\<`string`, \{ `balance`: `bigint`; `codeHash`: `any`; `nonce`: `bigint`; `storage`: `Record`\<`string`, `any`\>; `storageRoot`: `any`; `throwOnFail`: `boolean`; \}\>; \}\>

Defined in: packages/actions/types/LoadState/zLoadStateParams.d.ts:1
