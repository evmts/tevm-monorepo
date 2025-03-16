[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / zLoadStateParams

# Variable: zLoadStateParams

> `const` **zLoadStateParams**: `ZodObject`\<\{ `state`: `ZodRecord`\<`ZodString`, `ZodObject`\<`extendShape`\<\{ `throwOnFail`: `ZodOptional`\<`ZodBoolean`\>; \}, \{ `balance`: `ZodBigInt`; `codeHash`: `any`; `nonce`: `ZodBigInt`; `storage`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `any`\>\>; `storageRoot`: `any`; \}\>, `"strip"`, `ZodTypeAny`, \{ `balance`: `bigint`; `codeHash`: `any`; `nonce`: `bigint`; `storage`: `Record`\<`string`, `any`\>; `storageRoot`: `any`; `throwOnFail`: `boolean`; \}, \{ `balance`: `bigint`; `codeHash`: `any`; `nonce`: `bigint`; `storage`: `Record`\<`string`, `any`\>; `storageRoot`: `any`; `throwOnFail`: `boolean`; \}\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `state`: `Record`\<`string`, \{ `balance`: `bigint`; `codeHash`: `any`; `nonce`: `bigint`; `storage`: `Record`\<`string`, `any`\>; `storageRoot`: `any`; `throwOnFail`: `boolean`; \}\>; \}, \{ `state`: `Record`\<`string`, \{ `balance`: `bigint`; `codeHash`: `any`; `nonce`: `bigint`; `storage`: `Record`\<`string`, `any`\>; `storageRoot`: `any`; `throwOnFail`: `boolean`; \}\>; \}\>

Defined in: [packages/actions/src/LoadState/zLoadStateParams.js:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/LoadState/zLoadStateParams.js#L15)
