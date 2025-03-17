[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / zLoadStateParams

# Variable: zLoadStateParams

> `const` **zLoadStateParams**: `ZodObject`\<\{ `state`: `ZodRecord`\<`ZodString`, `ZodObject`\<`extendShape`\<\{ `throwOnFail`: `ZodOptional`\<`ZodBoolean`\>; \}, \{ `balance`: `ZodBigInt`; `codeHash`: `ZodString`; `nonce`: `ZodBigInt`; `storage`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodString`\>\>; `storageRoot`: `ZodString`; \}\>, `"strip"`, `ZodTypeAny`, \{ `balance`: `bigint`; `codeHash`: `string`; `nonce`: `bigint`; `storage`: `Record`\<`string`, `string`\>; `storageRoot`: `string`; `throwOnFail`: `boolean`; \}, \{ `balance`: `bigint`; `codeHash`: `string`; `nonce`: `bigint`; `storage`: `Record`\<`string`, `string`\>; `storageRoot`: `string`; `throwOnFail`: `boolean`; \}\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `state`: `Record`\<`string`, \{ `balance`: `bigint`; `codeHash`: `string`; `nonce`: `bigint`; `storage`: `Record`\<`string`, `string`\>; `storageRoot`: `string`; `throwOnFail`: `boolean`; \}\>; \}, \{ `state`: `Record`\<`string`, \{ `balance`: `bigint`; `codeHash`: `string`; `nonce`: `bigint`; `storage`: `Record`\<`string`, `string`\>; `storageRoot`: `string`; `throwOnFail`: `boolean`; \}\>; \}\>

Defined in: [packages/actions/src/LoadState/zLoadStateParams.js:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/LoadState/zLoadStateParams.js#L15)
