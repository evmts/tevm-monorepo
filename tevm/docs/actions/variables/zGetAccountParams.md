[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / zGetAccountParams

# Variable: zGetAccountParams

> `const` **zGetAccountParams**: `z.ZodObject`\<`z.objectUtil.extendShape`\<\{ `throwOnFail`: `z.ZodOptional`\<`z.ZodBoolean`\>; \}, \{ `address`: `z.ZodEffects`\<`z.ZodString`, `` `0x${string}` ``, `string`\>; `blockTag`: `z.ZodOptional`\<`z.ZodUnion`\<\[`z.ZodLiteral`\<`"latest"`\>, `z.ZodLiteral`\<`"earliest"`\>, `z.ZodLiteral`\<`"pending"`\>, `z.ZodLiteral`\<`"safe"`\>, `z.ZodLiteral`\<`"finalized"`\>, `z.ZodBigInt`, `z.ZodEffects`\<`z.ZodString`, `` `0x${string}` ``, `string`\>\]\>\>; `returnStorage`: `z.ZodOptional`\<`z.ZodBoolean`\>; \}\>, `"strip"`, `z.ZodTypeAny`, \{ `address`: `` `0x${string}` ``; `blockTag`: `bigint` \| `` `0x${string}` `` \| `"latest"` \| `"earliest"` \| `"pending"` \| `"safe"` \| `"finalized"`; `returnStorage`: `boolean`; `throwOnFail`: `boolean`; \}, \{ `address`: `string`; `blockTag`: `string` \| `bigint`; `returnStorage`: `boolean`; `throwOnFail`: `boolean`; \}\>

Defined in: packages/actions/types/GetAccount/zGetAccountParams.d.ts:4

Zod validator for a valid getAccount action
