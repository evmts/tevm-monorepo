[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / zBlock

# Variable: zBlock

> `const` **zBlock**: `ZodObject`\<\{ `baseFeePerGas`: `ZodOptional`\<`ZodBigInt`\>; `blobGasPrice`: `ZodOptional`\<`ZodBigInt`\>; `coinbase`: `ZodEffects`\<`ZodString`, `` `0x${string}` ``, `string`\>; `difficulty`: `ZodBigInt`; `gasLimit`: `ZodBigInt`; `number`: `ZodBigInt`; `timestamp`: `ZodBigInt`; \}, `"strict"`, `ZodTypeAny`, \{ `baseFeePerGas?`: `bigint`; `blobGasPrice?`: `bigint`; `coinbase`: `` `0x${string}` ``; `difficulty`: `bigint`; `gasLimit`: `bigint`; `number`: `bigint`; `timestamp`: `bigint`; \}, \{ `baseFeePerGas?`: `bigint`; `blobGasPrice?`: `bigint`; `coinbase`: `string`; `difficulty`: `bigint`; `gasLimit`: `bigint`; `number`: `bigint`; `timestamp`: `bigint`; \}\>

Defined in: [packages/actions/src/internal/zod/zBlock.js:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/internal/zod/zBlock.js#L7)

Zod validator for a block header specification within actions
