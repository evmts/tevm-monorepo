[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / zMineParams

# Variable: zMineParams

> `const` **zMineParams**: `z.ZodObject`\<`z.objectUtil.extendShape`\<\{ `throwOnFail`: `z.ZodOptional`\<`z.ZodBoolean`\>; \}, \{ `blockCount`: `z.ZodOptional`\<`z.ZodNumber`\>; `interval`: `z.ZodOptional`\<`z.ZodNumber`\>; `onBlock`: `z.ZodOptional`\<`z.ZodFunction`\<`z.ZodTuple`\<\[\], `z.ZodUnknown`\>, `z.ZodUnknown`\>\>; `onLog`: `z.ZodOptional`\<`z.ZodFunction`\<`z.ZodTuple`\<\[\], `z.ZodUnknown`\>, `z.ZodUnknown`\>\>; `onReceipt`: `z.ZodOptional`\<`z.ZodFunction`\<`z.ZodTuple`\<\[\], `z.ZodUnknown`\>, `z.ZodUnknown`\>\>; \}\>, `"strip"`, `z.ZodTypeAny`, \{ `blockCount`: `number`; `interval`: `number`; `onBlock`: (...`args`) => `unknown`; `onLog`: (...`args`) => `unknown`; `onReceipt`: (...`args`) => `unknown`; `throwOnFail`: `boolean`; \}, \{ `blockCount`: `number`; `interval`: `number`; `onBlock`: (...`args`) => `unknown`; `onLog`: (...`args`) => `unknown`; `onReceipt`: (...`args`) => `unknown`; `throwOnFail`: `boolean`; \}\>

Defined in: packages/actions/dist/index.d.ts:2731

Zod validator for a valid mine action invocation
