[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / zGetAccountParams

# Variable: zGetAccountParams

> `const` **zGetAccountParams**: `z.ZodObject`\<`z.objectUtil.extendShape`\<\{ `throwOnFail`: `z.ZodOptional`\<`z.ZodBoolean`\>; \}, \{ `address`: `z.ZodType`\<`any`, `z.ZodTypeDef`, `any`\>; `blockTag`: `z.ZodOptional`\<`z.ZodUnion`\<\[`z.ZodLiteral`\<`"latest"`\>, `z.ZodLiteral`\<`"earliest"`\>, `z.ZodLiteral`\<`"pending"`\>, `z.ZodLiteral`\<`"safe"`\>, `z.ZodLiteral`\<`"finalized"`\>, `z.ZodBigInt`, `z.ZodEffects`\<`z.ZodNumber`, `bigint`, `number`\>, `z.ZodString`\]\>\>; `returnStorage`: `z.ZodOptional`\<`z.ZodBoolean`\>; \}\>, `"strip"`, `z.ZodTypeAny`, \{ `address`: `any`; `blockTag`: `string` \| `bigint`; `returnStorage`: `boolean`; `throwOnFail`: `boolean`; \}, \{ `address`: `any`; `blockTag`: `string` \| `number` \| `bigint`; `returnStorage`: `boolean`; `throwOnFail`: `boolean`; \}\>

Defined in: packages/actions/dist/index.d.ts:2213

Zod validator for a valid getAccount action
