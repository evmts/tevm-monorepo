[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / zGetAccountParams

# Variable: zGetAccountParams

> `const` **zGetAccountParams**: `z.ZodObject`\<`z.objectUtil.extendShape`\<\{ `throwOnFail`: `z.ZodOptional`\<`z.ZodBoolean`\>; \}, \{ `address`: `any`; `blockTag`: `z.ZodOptional`\<`z.ZodUnion`\<\[`z.ZodLiteral`\<`"latest"`\>, `z.ZodLiteral`\<`"earliest"`\>, `z.ZodLiteral`\<`"pending"`\>, `z.ZodLiteral`\<`"safe"`\>, `z.ZodLiteral`\<`"finalized"`\>, `z.ZodBigInt`, `z.ZodEffects`\<`z.ZodNumber`, `bigint`, `number`\>, `any`\]\>\>; `returnStorage`: `z.ZodOptional`\<`z.ZodBoolean`\>; \}\>, `"strip"`, `z.ZodTypeAny`, \{ `address`: `any`; `blockTag`: `any`; `returnStorage`: `boolean`; `throwOnFail`: `boolean`; \}, \{ `address`: `any`; `blockTag`: `any`; `returnStorage`: `boolean`; `throwOnFail`: `boolean`; \}\>

Defined in: packages/actions/types/GetAccount/zGetAccountParams.d.ts:4

Zod validator for a valid getAccount action
