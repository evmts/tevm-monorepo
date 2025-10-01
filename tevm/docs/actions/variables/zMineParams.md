[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / zMineParams

# Variable: zMineParams

> `const` **zMineParams**: `z.ZodObject`\<\{ `blockCount`: `z.ZodOptional`\<`z.ZodNumber`\>; `interval`: `z.ZodOptional`\<`z.ZodNumber`\>; `onBlock`: `z.ZodOptional`\<`z.ZodFunction`\<`z.core.$ZodFunctionArgs`, `z.core.$ZodFunctionOut`\>\>; `onLog`: `z.ZodOptional`\<`z.ZodFunction`\<`z.core.$ZodFunctionArgs`, `z.core.$ZodFunctionOut`\>\>; `onReceipt`: `z.ZodOptional`\<`z.ZodFunction`\<`z.core.$ZodFunctionArgs`, `z.core.$ZodFunctionOut`\>\>; `throwOnFail`: `z.ZodOptional`\<`z.ZodBoolean`\>; \}, `z.core.$strip`\>

Defined in: packages/actions/types/Mine/zMineParams.d.ts:4

Zod validator for a valid mine action invocation
