[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / zSetAccountParams

# Variable: zSetAccountParams

> `const` **zSetAccountParams**: `z.ZodObject`\<\{ `address`: `z.ZodPipe`\<`z.ZodString`, `z.ZodTransform`\<`string`, `string`\>\>; `balance`: `z.ZodOptional`\<`z.ZodBigInt`\>; `deployedBytecode`: `z.ZodOptional`\<`z.ZodPipe`\<`z.ZodString`, `z.ZodTransform`\<`` `0x${string}` ``, `string`\>\>\>; `nonce`: `z.ZodOptional`\<`z.ZodBigInt`\>; `state`: `z.ZodOptional`\<`z.ZodRecord`\<`z.ZodPipe`\<`z.ZodString`, `z.ZodTransform`\<`` `0x${string}` ``, `string`\>\>, `z.ZodPipe`\<`z.ZodString`, `z.ZodTransform`\<`` `0x${string}` ``, `string`\>\>\>\>; `stateDiff`: `z.ZodOptional`\<`z.ZodRecord`\<`z.ZodPipe`\<`z.ZodString`, `z.ZodTransform`\<`` `0x${string}` ``, `string`\>\>, `z.ZodPipe`\<`z.ZodString`, `z.ZodTransform`\<`` `0x${string}` ``, `string`\>\>\>\>; `storageRoot`: `z.ZodOptional`\<`z.ZodPipe`\<`z.ZodString`, `z.ZodTransform`\<`string`, `string`\>\>\>; `throwOnFail`: `z.ZodOptional`\<`z.ZodBoolean`\>; \}, `z.core.$strip`\>

Defined in: packages/actions/types/SetAccount/zSetAccountParams.d.ts:4

Zod validator for a valid setAccount action
