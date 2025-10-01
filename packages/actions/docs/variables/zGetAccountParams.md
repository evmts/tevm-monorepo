[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / zGetAccountParams

# Variable: zGetAccountParams

> `const` **zGetAccountParams**: `ZodObject`\<\{ `address`: `ZodPipe`\<`ZodString`, `ZodTransform`\<`string`, `string`\>\>; `blockTag`: `ZodOptional`\<`ZodUnion`\<readonly \[`ZodLiteral`\<`"latest"`\>, `ZodLiteral`\<`"earliest"`\>, `ZodLiteral`\<`"pending"`\>, `ZodLiteral`\<`"safe"`\>, `ZodLiteral`\<`"finalized"`\>, `ZodBigInt`, `ZodPipe`\<`ZodNumber`, `ZodTransform`\<`bigint`, `number`\>\>, `ZodPipe`\<`ZodString`, `ZodTransform`\<`` `0x${string}` ``, `string`\>\>\]\>\>; `returnStorage`: `ZodOptional`\<`ZodBoolean`\>; `throwOnFail`: `ZodOptional`\<`ZodBoolean`\>; \}, `$strip`\>

Defined in: [packages/actions/src/GetAccount/zGetAccountParams.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/GetAccount/zGetAccountParams.js#L9)

Zod validator for a valid getAccount action
