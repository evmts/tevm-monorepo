[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / zSetAccountParams

# Variable: zSetAccountParams

> `const` **zSetAccountParams**: `ZodEffects`\<`ZodObject`\<`object` & `object`, `"strip"`, `ZodTypeAny`, \{ `address`: `` `0x${string}` ``; `balance?`: `bigint`; `deployedBytecode?`: `` `0x${string}` ``; `nonce?`: `bigint`; `state?`: `Partial`\<`Record`\<`` `0x${string}` ``, `` `0x${string}` ``\>\>; `stateDiff?`: `Partial`\<`Record`\<`` `0x${string}` ``, `` `0x${string}` ``\>\>; `storageRoot?`: `string`; `throwOnFail?`: `boolean`; \}, \{ `address`: `string`; `balance?`: `bigint`; `deployedBytecode?`: `string`; `nonce?`: `bigint`; `state?`: `Record`\<`string`, `string`\>; `stateDiff?`: `Record`\<`string`, `string`\>; `storageRoot?`: `string`; `throwOnFail?`: `boolean`; \}\>, \{ `address`: `` `0x${string}` ``; `balance?`: `bigint`; `deployedBytecode?`: `` `0x${string}` ``; `nonce?`: `bigint`; `state?`: `Partial`\<`Record`\<`` `0x${string}` ``, `` `0x${string}` ``\>\>; `stateDiff?`: `Partial`\<`Record`\<`` `0x${string}` ``, `` `0x${string}` ``\>\>; `storageRoot?`: `string`; `throwOnFail?`: `boolean`; \}, \{ `address`: `string`; `balance?`: `bigint`; `deployedBytecode?`: `string`; `nonce?`: `bigint`; `state?`: `Record`\<`string`, `string`\>; `stateDiff?`: `Record`\<`string`, `string`\>; `storageRoot?`: `string`; `throwOnFail?`: `boolean`; \}\>

Defined in: [packages/actions/src/SetAccount/zSetAccountParams.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/SetAccount/zSetAccountParams.js#L11)

Zod validator for a valid setAccount action
