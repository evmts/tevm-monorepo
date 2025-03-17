[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / zLoadStateParams

# Variable: zLoadStateParams

> `const` **zLoadStateParams**: `z.ZodObject`\<\{ `state`: `z.ZodRecord`\<`z.ZodString`, `z.ZodObject`\<`z.objectUtil.extendShape`\<\{ `throwOnFail`: `z.ZodOptional`\<`z.ZodBoolean`\>; \}, \{ `balance`: `z.ZodBigInt`; `codeHash`: `z.ZodString`; `nonce`: `z.ZodBigInt`; `storage`: `z.ZodOptional`\<`z.ZodRecord`\<`z.ZodString`, `z.ZodString`\>\>; `storageRoot`: `z.ZodString`; \}\>, `"strip"`, `z.ZodTypeAny`, \{ `balance`: `bigint`; `codeHash`: `string`; `nonce`: `bigint`; `storage`: `Record`\<`string`, `string`\>; `storageRoot`: `string`; `throwOnFail`: `boolean`; \}, \{ `balance`: `bigint`; `codeHash`: `string`; `nonce`: `bigint`; `storage`: `Record`\<`string`, `string`\>; `storageRoot`: `string`; `throwOnFail`: `boolean`; \}\>\>; \}, `"strip"`, `z.ZodTypeAny`, \{ `state`: `Record`\<`string`, \{ `balance`: `bigint`; `codeHash`: `string`; `nonce`: `bigint`; `storage`: `Record`\<`string`, `string`\>; `storageRoot`: `string`; `throwOnFail`: `boolean`; \}\>; \}, \{ `state`: `Record`\<`string`, \{ `balance`: `bigint`; `codeHash`: `string`; `nonce`: `bigint`; `storage`: `Record`\<`string`, `string`\>; `storageRoot`: `string`; `throwOnFail`: `boolean`; \}\>; \}\>

Defined in: packages/actions/dist/index.d.ts:2522
