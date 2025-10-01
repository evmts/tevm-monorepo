[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / zGetAccountParams

# Variable: zGetAccountParams

> `const` **zGetAccountParams**: `z.ZodObject`\<\{ `address`: `z.ZodPipe`\<`z.ZodString`, `z.ZodTransform`\<`string`, `string`\>\>; `blockTag`: `z.ZodOptional`\<`z.ZodUnion`\<readonly \[`z.ZodLiteral`\<`"latest"`\>, `z.ZodLiteral`\<`"earliest"`\>, `z.ZodLiteral`\<`"pending"`\>, `z.ZodLiteral`\<`"safe"`\>, `z.ZodLiteral`\<`"finalized"`\>, `z.ZodBigInt`, `z.ZodPipe`\<`z.ZodNumber`, `z.ZodTransform`\<`bigint`, `number`\>\>, `z.ZodPipe`\<`z.ZodString`, `z.ZodTransform`\<`` `0x${string}` ``, `string`\>\>\]\>\>; `returnStorage`: `z.ZodOptional`\<`z.ZodBoolean`\>; `throwOnFail`: `z.ZodOptional`\<`z.ZodBoolean`\>; \}, `z.core.$strip`\>

Defined in: packages/actions/types/GetAccount/zGetAccountParams.d.ts:4

Zod validator for a valid getAccount action
