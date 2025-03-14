[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / zMineParams

# Variable: zMineParams

> `const` **zMineParams**: `ZodObject`\<`extendShape`\<\{ `throwOnFail`: `ZodOptional`\<`ZodBoolean`\>; \}, \{ `blockCount`: `ZodOptional`\<`ZodNumber`\>; `interval`: `ZodOptional`\<`ZodNumber`\>; `onBlock`: `ZodOptional`\<`ZodFunction`\<`ZodTuple`\<\[\], `ZodUnknown`\>, `ZodUnknown`\>\>; `onLog`: `ZodOptional`\<`ZodFunction`\<`ZodTuple`\<\[\], `ZodUnknown`\>, `ZodUnknown`\>\>; `onReceipt`: `ZodOptional`\<`ZodFunction`\<`ZodTuple`\<\[\], `ZodUnknown`\>, `ZodUnknown`\>\>; \}\>, `"strip"`, `ZodTypeAny`, \{ `blockCount`: `number`; `interval`: `number`; `onBlock`: (...`args`) => `unknown`; `onLog`: (...`args`) => `unknown`; `onReceipt`: (...`args`) => `unknown`; `throwOnFail`: `boolean`; \}, \{ `blockCount`: `number`; `interval`: `number`; `onBlock`: (...`args`) => `unknown`; `onLog`: (...`args`) => `unknown`; `onReceipt`: (...`args`) => `unknown`; `throwOnFail`: `boolean`; \}\>

Defined in: [packages/actions/src/Mine/zMineParams.js:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/Mine/zMineParams.js#L7)

Zod validator for a valid mine action invocation
