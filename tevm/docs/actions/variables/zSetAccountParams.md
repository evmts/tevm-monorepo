[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / zSetAccountParams

# Variable: zSetAccountParams

> `const` **zSetAccountParams**: `z.ZodEffects`\<`z.ZodObject`\<`z.objectUtil.extendShape`\<\{ `throwOnFail`: `z.ZodOptional`\<`z.ZodBoolean`\>; \}, \{ `address`: `any`; `balance`: `z.ZodOptional`\<`z.ZodBigInt`\>; `deployedBytecode`: `any`; `nonce`: `z.ZodOptional`\<`z.ZodBigInt`\>; `state`: `z.ZodOptional`\<`z.ZodRecord`\<`any`, `any`\>\>; `stateDiff`: `z.ZodOptional`\<`z.ZodRecord`\<`any`, `any`\>\>; `storageRoot`: `z.ZodOptional`\<`z.ZodEffects`\<`z.ZodString`, `string`, `string`\>\>; \}\>, `"strip"`, `z.ZodTypeAny`, \{ `address`: `any`; `balance`: `bigint`; `deployedBytecode`: `any`; `nonce`: `bigint`; `state`: `Record`\<`any`, `any`\>; `stateDiff`: `Record`\<`any`, `any`\>; `storageRoot`: `string`; `throwOnFail`: `boolean`; \}, \{ `address`: `any`; `balance`: `bigint`; `deployedBytecode`: `any`; `nonce`: `bigint`; `state`: `Record`\<`any`, `any`\>; `stateDiff`: `Record`\<`any`, `any`\>; `storageRoot`: `string`; `throwOnFail`: `boolean`; \}\>, \{ `address`: `any`; `balance`: `bigint`; `deployedBytecode`: `any`; `nonce`: `bigint`; `state`: `Record`\<`any`, `any`\>; `stateDiff`: `Record`\<`any`, `any`\>; `storageRoot`: `string`; `throwOnFail`: `boolean`; \}, \{ `address`: `any`; `balance`: `bigint`; `deployedBytecode`: `any`; `nonce`: `bigint`; `state`: `Record`\<`any`, `any`\>; `stateDiff`: `Record`\<`any`, `any`\>; `storageRoot`: `string`; `throwOnFail`: `boolean`; \}\>

Defined in: packages/actions/types/SetAccount/zSetAccountParams.d.ts:4

Zod validator for a valid setAccount action
