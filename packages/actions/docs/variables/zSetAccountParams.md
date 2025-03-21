[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / zSetAccountParams

# Variable: zSetAccountParams

> `const` **zSetAccountParams**: `ZodEffects`\<`ZodObject`\<`extendShape`\<\{ `throwOnFail`: `ZodOptional`\<`ZodBoolean`\>; \}, \{ `address`: `any`; `balance`: `ZodOptional`\<`ZodBigInt`\>; `deployedBytecode`: `any`; `nonce`: `ZodOptional`\<`ZodBigInt`\>; `state`: `ZodOptional`\<`ZodRecord`\<`any`, `any`\>\>; `stateDiff`: `ZodOptional`\<`ZodRecord`\<`any`, `any`\>\>; `storageRoot`: `ZodOptional`\<`ZodEffects`\<`ZodString`, `string`, `string`\>\>; \}\>, `"strip"`, `ZodTypeAny`, \{ `address`: `any`; `balance`: `bigint`; `deployedBytecode`: `any`; `nonce`: `bigint`; `state`: `Record`\<`any`, `any`\>; `stateDiff`: `Record`\<`any`, `any`\>; `storageRoot`: `string`; `throwOnFail`: `boolean`; \}, \{ `address`: `any`; `balance`: `bigint`; `deployedBytecode`: `any`; `nonce`: `bigint`; `state`: `Record`\<`any`, `any`\>; `stateDiff`: `Record`\<`any`, `any`\>; `storageRoot`: `string`; `throwOnFail`: `boolean`; \}\>, \{ `address`: `any`; `balance`: `bigint`; `deployedBytecode`: `any`; `nonce`: `bigint`; `state`: `Record`\<`any`, `any`\>; `stateDiff`: `Record`\<`any`, `any`\>; `storageRoot`: `string`; `throwOnFail`: `boolean`; \}, \{ `address`: `any`; `balance`: `bigint`; `deployedBytecode`: `any`; `nonce`: `bigint`; `state`: `Record`\<`any`, `any`\>; `stateDiff`: `Record`\<`any`, `any`\>; `storageRoot`: `string`; `throwOnFail`: `boolean`; \}\>

Defined in: [packages/actions/src/SetAccount/zSetAccountParams.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/SetAccount/zSetAccountParams.js#L11)

Zod validator for a valid setAccount action
