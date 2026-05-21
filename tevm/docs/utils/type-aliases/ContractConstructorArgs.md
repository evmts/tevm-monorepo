[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [utils](../README.md) / ContractConstructorArgs

# Type Alias: ContractConstructorArgs\<abi\>

> **ContractConstructorArgs**\<`abi`\> = [`AbiParametersToPrimitiveTypes`](../../index/type-aliases/AbiParametersToPrimitiveTypes.md)\<`Extract`\<`abi` *extends* [`Abi`](../../index/type-aliases/Abi.md) ? `abi` : [`Abi`](../../index/type-aliases/Abi.md)\[`number`\], \{ `type`: `"constructor"`; \}\>\[`"inputs"`\], `"inputs"`, `true`\> *extends* infer args ? \[`args`\] *extends* \[`never`\] ? readonly `unknown`[] : `args` : readonly `unknown`[]

Defined in: tevm-monorepo/node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/types/contract.d.ts:9

## Type Parameters

### abi

`abi` *extends* [`Abi`](../../index/type-aliases/Abi.md) \| readonly `unknown`[] = [`Abi`](../../index/type-aliases/Abi.md)
