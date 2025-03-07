[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / zLoadStateParams

# Variable: zLoadStateParams

> `const` **zLoadStateParams**: `ZodObject`\<\{ `state`: `ZodRecord`\<`ZodString`, `ZodObject`\<`extendShape`\<\{ `throwOnFail`: `ZodOptional`\<`ZodBoolean`\>; \}, \{ `balance`: `ZodBigInt`; `codeHash`: `ZodEffects`\<`ZodString`, `` `0x${string}` ``, `string`\>; `nonce`: `ZodBigInt`; `storage`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodEffects`\<`ZodString`, `` `0x${string}` ``, `string`\>\>\>; `storageRoot`: `ZodEffects`\<`ZodString`, `` `0x${string}` ``, `string`\>; \}\>, `"strip"`, `ZodTypeAny`, \{ `balance`: `bigint`; `codeHash`: `` `0x${string}` ``; `nonce`: `bigint`; `storage`: `Record`\<`string`, `` `0x${string}` ``\>; `storageRoot`: `` `0x${string}` ``; `throwOnFail`: `boolean`; \}, \{ `balance`: `bigint`; `codeHash`: `string`; `nonce`: `bigint`; `storage`: `Record`\<`string`, `string`\>; `storageRoot`: `string`; `throwOnFail`: `boolean`; \}\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `state`: `Record`\<`string`, \{ `balance`: `bigint`; `codeHash`: `` `0x${string}` ``; `nonce`: `bigint`; `storage`: `Record`\<`string`, `` `0x${string}` ``\>; `storageRoot`: `` `0x${string}` ``; `throwOnFail`: `boolean`; \}\>; \}, \{ `state`: `Record`\<`string`, \{ `balance`: `bigint`; `codeHash`: `string`; `nonce`: `bigint`; `storage`: `Record`\<`string`, `string`\>; `storageRoot`: `string`; `throwOnFail`: `boolean`; \}\>; \}\>

Defined in: [packages/actions/src/LoadState/zLoadStateParams.js:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/LoadState/zLoadStateParams.js#L15)
