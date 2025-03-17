[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / zGetAccountParams

# Variable: zGetAccountParams

> `const` **zGetAccountParams**: `ZodObject`\<`extendShape`\<\{ `throwOnFail`: `ZodOptional`\<`ZodBoolean`\>; \}, \{ `address`: `ZodType`\<`any`, `ZodTypeDef`, `any`\>; `blockTag`: `ZodOptional`\<`ZodUnion`\<\[`ZodLiteral`\<`"latest"`\>, `ZodLiteral`\<`"earliest"`\>, `ZodLiteral`\<`"pending"`\>, `ZodLiteral`\<`"safe"`\>, `ZodLiteral`\<`"finalized"`\>, `ZodBigInt`, `ZodEffects`\<`ZodNumber`, `bigint`, `number`\>, `ZodString`\]\>\>; `returnStorage`: `ZodOptional`\<`ZodBoolean`\>; \}\>, `"strip"`, `ZodTypeAny`, \{ `address`: `any`; `blockTag`: `string` \| `bigint`; `returnStorage`: `boolean`; `throwOnFail`: `boolean`; \}, \{ `address`: `any`; `blockTag`: `string` \| `number` \| `bigint`; `returnStorage`: `boolean`; `throwOnFail`: `boolean`; \}\>

Defined in: [packages/actions/src/GetAccount/zGetAccountParams.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/zGetAccountParams.js#L9)

Zod validator for a valid getAccount action
