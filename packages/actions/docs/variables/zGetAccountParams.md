[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / zGetAccountParams

# Variable: zGetAccountParams

> `const` **zGetAccountParams**: `ZodObject`\<`extendShape`\<\{ `throwOnFail`: `ZodOptional`\<`ZodBoolean`\>; \}, \{ `address`: `ZodEffects`\<`ZodString`, `` `0x${string}` ``, `string`\>; `blockTag`: `ZodOptional`\<`ZodUnion`\<\[`ZodLiteral`\<`"latest"`\>, `ZodLiteral`\<`"earliest"`\>, `ZodLiteral`\<`"pending"`\>, `ZodLiteral`\<`"safe"`\>, `ZodLiteral`\<`"finalized"`\>, `ZodBigInt`, `ZodEffects`\<`ZodString`, `` `0x${string}` ``, `string`\>\]\>\>; `returnStorage`: `ZodOptional`\<`ZodBoolean`\>; \}\>, `"strip"`, `ZodTypeAny`, \{ `address`: `` `0x${string}` ``; `blockTag`: `bigint` \| `` `0x${string}` `` \| `"latest"` \| `"earliest"` \| `"pending"` \| `"safe"` \| `"finalized"`; `returnStorage`: `boolean`; `throwOnFail`: `boolean`; \}, \{ `address`: `string`; `blockTag`: `string` \| `bigint`; `returnStorage`: `boolean`; `throwOnFail`: `boolean`; \}\>

Defined in: [packages/actions/src/GetAccount/zGetAccountParams.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/zGetAccountParams.js#L9)

Zod validator for a valid getAccount action
