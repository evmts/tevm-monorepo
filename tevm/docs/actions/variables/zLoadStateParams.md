[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / zLoadStateParams

# Variable: zLoadStateParams

> `const` **zLoadStateParams**: `z.ZodObject`\<\{ `state`: `z.ZodRecord`\<`z.ZodString`, `z.ZodObject`\<`z.objectUtil.extendShape`\<\{ `throwOnFail`: `z.ZodOptional`\<`z.ZodBoolean`\>; \}, \{ `balance`: `z.ZodBigInt`; `codeHash`: `z.ZodEffects`\<`z.ZodString`, `` `0x${string}` ``, `string`\>; `nonce`: `z.ZodBigInt`; `storage`: `z.ZodOptional`\<`z.ZodRecord`\<`z.ZodString`, `z.ZodEffects`\<`z.ZodString`, `` `0x${string}` ``, `string`\>\>\>; `storageRoot`: `z.ZodEffects`\<`z.ZodString`, `` `0x${string}` ``, `string`\>; \}\>, `"strip"`, `z.ZodTypeAny`, \{ `balance`: `bigint`; `codeHash`: `` `0x${string}` ``; `nonce`: `bigint`; `storage`: `Record`\<`string`, `` `0x${string}` ``\>; `storageRoot`: `` `0x${string}` ``; `throwOnFail`: `boolean`; \}, \{ `balance`: `bigint`; `codeHash`: `string`; `nonce`: `bigint`; `storage`: `Record`\<`string`, `string`\>; `storageRoot`: `string`; `throwOnFail`: `boolean`; \}\>\>; \}, `"strip"`, `z.ZodTypeAny`, \{ `state`: `Record`\<`string`, \{ `balance`: `bigint`; `codeHash`: `` `0x${string}` ``; `nonce`: `bigint`; `storage`: `Record`\<`string`, `` `0x${string}` ``\>; `storageRoot`: `` `0x${string}` ``; `throwOnFail`: `boolean`; \}\>; \}, \{ `state`: `Record`\<`string`, \{ `balance`: `bigint`; `codeHash`: `string`; `nonce`: `bigint`; `storage`: `Record`\<`string`, `string`\>; `storageRoot`: `string`; `throwOnFail`: `boolean`; \}\>; \}\>

Defined in: packages/actions/types/LoadState/zLoadStateParams.d.ts:1
