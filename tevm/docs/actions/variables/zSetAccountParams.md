[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / zSetAccountParams

# Variable: zSetAccountParams

> `const` **zSetAccountParams**: `z.ZodEffects`\<`z.ZodObject`\<`z.objectUtil.extendShape`\<\{ `throwOnFail`: `z.ZodOptional`\<`z.ZodBoolean`\>; \}, \{ `address`: `z.ZodType`\<`any`, `z.ZodTypeDef`, `any`\>; `balance`: `z.ZodOptional`\<`z.ZodBigInt`\>; `deployedBytecode`: `z.ZodOptional`\<`z.ZodEffects`\<`z.ZodString`, `string`, `string`\>\>; `nonce`: `z.ZodOptional`\<`z.ZodBigInt`\>; `state`: `z.ZodOptional`\<`z.ZodRecord`\<`z.ZodString`, `z.ZodString`\>\>; `stateDiff`: `z.ZodOptional`\<`z.ZodRecord`\<`z.ZodString`, `z.ZodString`\>\>; `storageRoot`: `z.ZodOptional`\<`z.ZodEffects`\<`z.ZodString`, `string`, `string`\>\>; \}\>, `"strip"`, `z.ZodTypeAny`, \{ `address`: `any`; `balance`: `bigint`; `deployedBytecode`: `string`; `nonce`: `bigint`; `state`: `Record`\<`string`, `string`\>; `stateDiff`: `Record`\<`string`, `string`\>; `storageRoot`: `string`; `throwOnFail`: `boolean`; \}, \{ `address`: `any`; `balance`: `bigint`; `deployedBytecode`: `string`; `nonce`: `bigint`; `state`: `Record`\<`string`, `string`\>; `stateDiff`: `Record`\<`string`, `string`\>; `storageRoot`: `string`; `throwOnFail`: `boolean`; \}\>, \{ `address`: `any`; `balance`: `bigint`; `deployedBytecode`: `string`; `nonce`: `bigint`; `state`: `Record`\<`string`, `string`\>; `stateDiff`: `Record`\<`string`, `string`\>; `storageRoot`: `string`; `throwOnFail`: `boolean`; \}, \{ `address`: `any`; `balance`: `bigint`; `deployedBytecode`: `string`; `nonce`: `bigint`; `state`: `Record`\<`string`, `string`\>; `stateDiff`: `Record`\<`string`, `string`\>; `storageRoot`: `string`; `throwOnFail`: `boolean`; \}\>

Defined in: packages/actions/dist/index.d.ts:2326

Zod validator for a valid setAccount action
