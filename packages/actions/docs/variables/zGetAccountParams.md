[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / zGetAccountParams

# Variable: zGetAccountParams

> `const` **zGetAccountParams**: `ZodObject`\<`extendShape`\<\{ `throwOnFail`: `ZodOptional`\<`ZodBoolean`\>; \}, \{ `address`: `any`; `blockTag`: `ZodOptional`\<`ZodUnion`\<\[`ZodLiteral`\<`"latest"`\>, `ZodLiteral`\<`"earliest"`\>, `ZodLiteral`\<`"pending"`\>, `ZodLiteral`\<`"safe"`\>, `ZodLiteral`\<`"finalized"`\>, `ZodBigInt`, `ZodEffects`\<`ZodNumber`, `bigint`, `number`\>, `any`\]\>\>; `returnStorage`: `ZodOptional`\<`ZodBoolean`\>; \}\>, `"strip"`, `ZodTypeAny`, \{ `address`: `any`; `blockTag`: `any`; `returnStorage`: `boolean`; `throwOnFail`: `boolean`; \}, \{ `address`: `any`; `blockTag`: `any`; `returnStorage`: `boolean`; `throwOnFail`: `boolean`; \}\>

Defined in: [packages/actions/src/GetAccount/zGetAccountParams.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/zGetAccountParams.js#L9)

Zod validator for a valid getAccount action
