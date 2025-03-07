[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / zStateOverrideSet

# Variable: zStateOverrideSet

> `const` **zStateOverrideSet**: `z.ZodRecord`\<`z.ZodEffects`\<`z.ZodString`, `` `0x${string}` ``, `string`\>, `z.ZodObject`\<\{ `balance`: `z.ZodOptional`\<`z.ZodBigInt`\>; `code`: `z.ZodOptional`\<`z.ZodEffects`\<`z.ZodString`, `` `0x${string}` ``, `string`\>\>; `nonce`: `z.ZodOptional`\<`z.ZodBigInt`\>; `state`: `z.ZodOptional`\<`z.ZodRecord`\<`z.ZodEffects`\<`z.ZodString`, `` `0x${string}` ``, `string`\>, `z.ZodEffects`\<`z.ZodString`, `` `0x${string}` ``, `string`\>\>\>; `stateDiff`: `z.ZodOptional`\<`z.ZodRecord`\<`z.ZodEffects`\<`z.ZodString`, `` `0x${string}` ``, `string`\>, `z.ZodEffects`\<`z.ZodString`, `` `0x${string}` ``, `string`\>\>\>; \}, `"strict"`, `z.ZodTypeAny`, \{ `balance`: `bigint`; `code`: `` `0x${string}` ``; `nonce`: `bigint`; `state`: `Partial`\<`Record`\<`` `0x${string}` ``, `` `0x${string}` ``\>\>; `stateDiff`: `Partial`\<`Record`\<`` `0x${string}` ``, `` `0x${string}` ``\>\>; \}, \{ `balance`: `bigint`; `code`: `string`; `nonce`: `bigint`; `state`: `Record`\<`string`, `string`\>; `stateDiff`: `Record`\<`string`, `string`\>; \}\>\>

Defined in: packages/actions/types/internal/zod/zStateOverrideSet.d.ts:1
