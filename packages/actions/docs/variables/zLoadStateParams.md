[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / zLoadStateParams

# Variable: zLoadStateParams

<<<<<<< HEAD
> `const` **zLoadStateParams**: `ZodObject`\<\{ `state`: `ZodRecord`\<`ZodString`, `ZodObject`\<`object` & `object`, `"strip"`, `ZodTypeAny`, \{ `balance`: `bigint`; `codeHash`: `` `0x${string}` ``; `nonce`: `bigint`; `storage?`: `Record`\<`string`, `` `0x${string}` ``\>; `storageRoot`: `` `0x${string}` ``; `throwOnFail?`: `boolean`; \}, \{ `balance`: `bigint`; `codeHash`: `string`; `nonce`: `bigint`; `storage?`: `Record`\<`string`, `string`\>; `storageRoot`: `string`; `throwOnFail?`: `boolean`; \}\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `state`: `Record`\<`string`, \{ `balance`: `bigint`; `codeHash`: `` `0x${string}` ``; `nonce`: `bigint`; `storage?`: `Record`\<`string`, `` `0x${string}` ``\>; `storageRoot`: `` `0x${string}` ``; `throwOnFail?`: `boolean`; \}\>; \}, \{ `state`: `Record`\<`string`, \{ `balance`: `bigint`; `codeHash`: `string`; `nonce`: `bigint`; `storage?`: `Record`\<`string`, `string`\>; `storageRoot`: `string`; `throwOnFail?`: `boolean`; \}\>; \}\>
=======
> `const` **zLoadStateParams**: `ZodObject`\<\{ `state`: `ZodRecord`\<`ZodPipe`\<`ZodString`, `ZodTransform`\<`` `0x${string}` ``, `string`\>\>, `ZodObject`\<\{ `balance`: `ZodPipe`\<`ZodString`, `ZodTransform`\<`` `0x${string}` ``, `string`\>\>; `codeHash`: `ZodPipe`\<`ZodString`, `ZodTransform`\<`` `0x${string}` ``, `string`\>\>; `nonce`: `ZodPipe`\<`ZodString`, `ZodTransform`\<`` `0x${string}` ``, `string`\>\>; `storage`: `ZodOptional`\<`ZodRecord`\<`ZodPipe`\<`ZodString`, `ZodTransform`\<`` `0x${string}` ``, `string`\>\>, `ZodPipe`\<`ZodString`, `ZodTransform`\<`` `0x${string}` ``, `string`\>\>\>\>; `storageRoot`: `ZodPipe`\<`ZodString`, `ZodTransform`\<`` `0x${string}` ``, `string`\>\>; `throwOnFail`: `ZodOptional`\<`ZodBoolean`\>; \}, `$strip`\>\>; \}, `$strip`\>
>>>>>>> ceeee8122 (docs: generate docs)

Defined in: [packages/actions/src/LoadState/zLoadStateParams.js:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/LoadState/zLoadStateParams.js#L15)
