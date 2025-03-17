[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / zSetAccountParams

# Variable: zSetAccountParams

> `const` **zSetAccountParams**: `ZodEffects`\<`ZodObject`\<`extendShape`\<\{ `throwOnFail`: `ZodOptional`\<`ZodBoolean`\>; \}, \{ `address`: `ZodType`\<`any`, `ZodTypeDef`, `any`\>; `balance`: `ZodOptional`\<`ZodBigInt`\>; `deployedBytecode`: `ZodOptional`\<`ZodEffects`\<`ZodString`, `string`, `string`\>\>; `nonce`: `ZodOptional`\<`ZodBigInt`\>; `state`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodString`\>\>; `stateDiff`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodString`\>\>; `storageRoot`: `ZodOptional`\<`ZodEffects`\<`ZodString`, `string`, `string`\>\>; \}\>, `"strip"`, `ZodTypeAny`, \{ `address`: `any`; `balance`: `bigint`; `deployedBytecode`: `string`; `nonce`: `bigint`; `state`: `Record`\<`string`, `string`\>; `stateDiff`: `Record`\<`string`, `string`\>; `storageRoot`: `string`; `throwOnFail`: `boolean`; \}, \{ `address`: `any`; `balance`: `bigint`; `deployedBytecode`: `string`; `nonce`: `bigint`; `state`: `Record`\<`string`, `string`\>; `stateDiff`: `Record`\<`string`, `string`\>; `storageRoot`: `string`; `throwOnFail`: `boolean`; \}\>, \{ `address`: `any`; `balance`: `bigint`; `deployedBytecode`: `string`; `nonce`: `bigint`; `state`: `Record`\<`string`, `string`\>; `stateDiff`: `Record`\<`string`, `string`\>; `storageRoot`: `string`; `throwOnFail`: `boolean`; \}, \{ `address`: `any`; `balance`: `bigint`; `deployedBytecode`: `string`; `nonce`: `bigint`; `state`: `Record`\<`string`, `string`\>; `stateDiff`: `Record`\<`string`, `string`\>; `storageRoot`: `string`; `throwOnFail`: `boolean`; \}\>

Defined in: [packages/actions/src/SetAccount/zSetAccountParams.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/SetAccount/zSetAccountParams.js#L11)

Zod validator for a valid setAccount action
