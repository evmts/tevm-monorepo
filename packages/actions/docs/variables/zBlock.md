[**@tevm/actions**](../README.md)

***

[@tevm/actions](../globals.md) / zBlock

# Variable: zBlock

> `const` **zBlock**: `ZodObject`\<\{ `baseFeePerGas`: `ZodOptional`\<`ZodBigInt`\>; `blobGasPrice`: `ZodOptional`\<`ZodBigInt`\>; `coinbase`: `ZodPipe`\<`ZodString`, `ZodTransform`\<`string`, `string`\>\>; `difficulty`: `ZodBigInt`; `gasLimit`: `ZodBigInt`; `number`: `ZodBigInt`; `timestamp`: `ZodBigInt`; \}, `$strict`\>

Defined in: [packages/actions/src/internal/zod/zBlock.js:7](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/internal/zod/zBlock.js#L7)

Zod validator for a block header specification within actions
