[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / zSetAccountParams

# Variable: zSetAccountParams

> `const` **zSetAccountParams**: `ZodObject`\<\{ `address`: `ZodPipe`\<`ZodString`, `ZodTransform`\<`string`, `string`\>\>; `balance`: `ZodOptional`\<`ZodBigInt`\>; `deployedBytecode`: `ZodOptional`\<`ZodPipe`\<`ZodString`, `ZodTransform`\<`` `0x${string}` ``, `string`\>\>\>; `nonce`: `ZodOptional`\<`ZodBigInt`\>; `state`: `ZodOptional`\<`ZodRecord`\<`ZodPipe`\<`ZodString`, `ZodTransform`\<`` `0x${string}` ``, `string`\>\>, `ZodPipe`\<`ZodString`, `ZodTransform`\<`` `0x${string}` ``, `string`\>\>\>\>; `stateDiff`: `ZodOptional`\<`ZodRecord`\<`ZodPipe`\<`ZodString`, `ZodTransform`\<`` `0x${string}` ``, `string`\>\>, `ZodPipe`\<`ZodString`, `ZodTransform`\<`` `0x${string}` ``, `string`\>\>\>\>; `storageRoot`: `ZodOptional`\<`ZodPipe`\<`ZodString`, `ZodTransform`\<`string`, `string`\>\>\>; `throwOnFail`: `ZodOptional`\<`ZodBoolean`\>; \}, `$strip`\>

Defined in: [packages/actions/src/SetAccount/zSetAccountParams.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/SetAccount/zSetAccountParams.js#L11)

Zod validator for a valid setAccount action
