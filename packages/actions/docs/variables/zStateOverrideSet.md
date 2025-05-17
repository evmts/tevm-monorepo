[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / zStateOverrideSet

# Variable: zStateOverrideSet

> `const` **zStateOverrideSet**: `ZodRecord`\<`ZodEffects`\<`ZodString`, `` `0x${string}` ``, `string`\>, `ZodObject`\<\{ `balance`: `ZodOptional`\<`ZodBigInt`\>; `code`: `ZodOptional`\<`ZodEffects`\<`ZodString`, `` `0x${string}` ``, `string`\>\>; `nonce`: `ZodOptional`\<`ZodBigInt`\>; `state`: `ZodOptional`\<`ZodRecord`\<`ZodEffects`\<`ZodString`, `` `0x${string}` ``, `string`\>, `ZodEffects`\<`ZodString`, `` `0x${string}` ``, `string`\>\>\>; `stateDiff`: `ZodOptional`\<`ZodRecord`\<`ZodEffects`\<`ZodString`, `` `0x${string}` ``, `string`\>, `ZodEffects`\<`ZodString`, `` `0x${string}` ``, `string`\>\>\>; \}, `"strict"`, `ZodTypeAny`, \{ `balance?`: `bigint`; `code?`: `` `0x${string}` ``; `nonce?`: `bigint`; `state?`: `Partial`\<`Record`\<`` `0x${string}` ``, `` `0x${string}` ``\>\>; `stateDiff?`: `Partial`\<`Record`\<`` `0x${string}` ``, `` `0x${string}` ``\>\>; \}, \{ `balance?`: `bigint`; `code?`: `string`; `nonce?`: `bigint`; `state?`: `Record`\<`string`, `string`\>; `stateDiff?`: `Record`\<`string`, `string`\>; \}\>\>

Defined in: [packages/actions/src/internal/zod/zStateOverrideSet.js:5](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/internal/zod/zStateOverrideSet.js#L5)
