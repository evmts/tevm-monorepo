[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / zSetAccountParams

# Variable: zSetAccountParams

> `const` **zSetAccountParams**: `z.ZodEffects`\<`z.ZodObject`\<`object` & `object`, `"strip"`, `z.ZodTypeAny`, \{ `address`: `` `0x${string}` ``; `balance?`: `bigint`; `deployedBytecode?`: `` `0x${string}` ``; `nonce?`: `bigint`; `state?`: `Partial`\<`Record`\<`` `0x${string}` ``, `` `0x${string}` ``\>\>; `stateDiff?`: `Partial`\<`Record`\<`` `0x${string}` ``, `` `0x${string}` ``\>\>; `storageRoot?`: `string`; `throwOnFail?`: `boolean`; \}, \{ `address`: `string`; `balance?`: `bigint`; `deployedBytecode?`: `string`; `nonce?`: `bigint`; `state?`: `Record`\<`string`, `string`\>; `stateDiff?`: `Record`\<`string`, `string`\>; `storageRoot?`: `string`; `throwOnFail?`: `boolean`; \}\>, \{ `address`: `` `0x${string}` ``; `balance?`: `bigint`; `deployedBytecode?`: `` `0x${string}` ``; `nonce?`: `bigint`; `state?`: `Partial`\<`Record`\<`` `0x${string}` ``, `` `0x${string}` ``\>\>; `stateDiff?`: `Partial`\<`Record`\<`` `0x${string}` ``, `` `0x${string}` ``\>\>; `storageRoot?`: `string`; `throwOnFail?`: `boolean`; \}, \{ `address`: `string`; `balance?`: `bigint`; `deployedBytecode?`: `string`; `nonce?`: `bigint`; `state?`: `Record`\<`string`, `string`\>; `stateDiff?`: `Record`\<`string`, `string`\>; `storageRoot?`: `string`; `throwOnFail?`: `boolean`; \}\>

Defined in: packages/actions/types/SetAccount/zSetAccountParams.d.ts:4

Zod validator for a valid setAccount action
