[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / zSetAccountParams

# Variable: zSetAccountParams

> `const` **zSetAccountParams**: `z.ZodEffects`\<`z.ZodObject`\<`z.objectUtil.extendShape`\<\{ `throwOnFail`: `z.ZodOptional`\<`z.ZodBoolean`\>; \}, \{ `address`: `z.ZodEffects`\<`z.ZodString`, `` `0x${string}` ``, `string`\>; `balance`: `z.ZodOptional`\<`z.ZodBigInt`\>; `deployedBytecode`: `z.ZodOptional`\<`z.ZodEffects`\<`z.ZodEffects`\<`z.ZodString`, `` `0x${string}` ``, `string`\>, `` `0x${string}` ``, `string`\>\>; `nonce`: `z.ZodOptional`\<`z.ZodBigInt`\>; `state`: `z.ZodOptional`\<`z.ZodRecord`\<`z.ZodEffects`\<`z.ZodString`, `` `0x${string}` ``, `string`\>, `z.ZodEffects`\<`z.ZodString`, `` `0x${string}` ``, `string`\>\>\>; `stateDiff`: `z.ZodOptional`\<`z.ZodRecord`\<`z.ZodEffects`\<`z.ZodString`, `` `0x${string}` ``, `string`\>, `z.ZodEffects`\<`z.ZodString`, `` `0x${string}` ``, `string`\>\>\>; `storageRoot`: `z.ZodOptional`\<`z.ZodEffects`\<`z.ZodString`, `string`, `string`\>\>; \}\>, `"strip"`, `z.ZodTypeAny`, \{ `address`: `` `0x${string}` ``; `balance`: `bigint`; `deployedBytecode`: `` `0x${string}` ``; `nonce`: `bigint`; `state`: `Partial`\<`Record`\<`` `0x${string}` ``, `` `0x${string}` ``\>\>; `stateDiff`: `Partial`\<`Record`\<`` `0x${string}` ``, `` `0x${string}` ``\>\>; `storageRoot`: `string`; `throwOnFail`: `boolean`; \}, \{ `address`: `string`; `balance`: `bigint`; `deployedBytecode`: `string`; `nonce`: `bigint`; `state`: `Record`\<`string`, `string`\>; `stateDiff`: `Record`\<`string`, `string`\>; `storageRoot`: `string`; `throwOnFail`: `boolean`; \}\>, \{ `address`: `` `0x${string}` ``; `balance`: `bigint`; `deployedBytecode`: `` `0x${string}` ``; `nonce`: `bigint`; `state`: `Partial`\<`Record`\<`` `0x${string}` ``, `` `0x${string}` ``\>\>; `stateDiff`: `Partial`\<`Record`\<`` `0x${string}` ``, `` `0x${string}` ``\>\>; `storageRoot`: `string`; `throwOnFail`: `boolean`; \}, \{ `address`: `string`; `balance`: `bigint`; `deployedBytecode`: `string`; `nonce`: `bigint`; `state`: `Record`\<`string`, `string`\>; `stateDiff`: `Record`\<`string`, `string`\>; `storageRoot`: `string`; `throwOnFail`: `boolean`; \}\>

Defined in: packages/actions/types/SetAccount/zSetAccountParams.d.ts:4

Zod validator for a valid setAccount action
