[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / zLoadStateParams

# Variable: zLoadStateParams

<<<<<<< HEAD
> `const` **zLoadStateParams**: `z.ZodObject`\<\{ `state`: `z.ZodRecord`\<`z.ZodString`, `z.ZodObject`\<`object` & `object`, `"strip"`, `z.ZodTypeAny`, \{ `balance`: `bigint`; `codeHash`: `` `0x${string}` ``; `nonce`: `bigint`; `storage?`: `Record`\<`string`, `` `0x${string}` ``\>; `storageRoot`: `` `0x${string}` ``; `throwOnFail?`: `boolean`; \}, \{ `balance`: `bigint`; `codeHash`: `string`; `nonce`: `bigint`; `storage?`: `Record`\<`string`, `string`\>; `storageRoot`: `string`; `throwOnFail?`: `boolean`; \}\>\>; \}, `"strip"`, `z.ZodTypeAny`, \{ `state`: `Record`\<`string`, \{ `balance`: `bigint`; `codeHash`: `` `0x${string}` ``; `nonce`: `bigint`; `storage?`: `Record`\<`string`, `` `0x${string}` ``\>; `storageRoot`: `` `0x${string}` ``; `throwOnFail?`: `boolean`; \}\>; \}, \{ `state`: `Record`\<`string`, \{ `balance`: `bigint`; `codeHash`: `string`; `nonce`: `bigint`; `storage?`: `Record`\<`string`, `string`\>; `storageRoot`: `string`; `throwOnFail?`: `boolean`; \}\>; \}\>
=======
> `const` **zLoadStateParams**: `z.ZodObject`\<\{ `state`: `z.ZodRecord`\<`z.ZodPipe`\<`z.ZodString`, `z.ZodTransform`\<`` `0x${string}` ``, `string`\>\>, `z.ZodObject`\<\{ `balance`: `z.ZodPipe`\<`z.ZodString`, `z.ZodTransform`\<`` `0x${string}` ``, `string`\>\>; `codeHash`: `z.ZodPipe`\<`z.ZodString`, `z.ZodTransform`\<`` `0x${string}` ``, `string`\>\>; `nonce`: `z.ZodPipe`\<`z.ZodString`, `z.ZodTransform`\<`` `0x${string}` ``, `string`\>\>; `storage`: `z.ZodOptional`\<`z.ZodRecord`\<`z.ZodPipe`\<`z.ZodString`, `z.ZodTransform`\<`` `0x${string}` ``, `string`\>\>, `z.ZodPipe`\<`z.ZodString`, `z.ZodTransform`\<`` `0x${string}` ``, `string`\>\>\>\>; `storageRoot`: `z.ZodPipe`\<`z.ZodString`, `z.ZodTransform`\<`` `0x${string}` ``, `string`\>\>; `throwOnFail`: `z.ZodOptional`\<`z.ZodBoolean`\>; \}, `z.core.$strip`\>\>; \}, `z.core.$strip`\>
>>>>>>> ceeee8122 (docs: generate docs)

Defined in: packages/actions/types/LoadState/zLoadStateParams.d.ts:1
