[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [utils](../README.md) / ContractConstructorArgs

# Type Alias: ContractConstructorArgs\<abi\>

> **ContractConstructorArgs**\<`abi`\> = [`AbiParametersToPrimitiveTypes`](../../index/type-aliases/AbiParametersToPrimitiveTypes.md)\<`Extract`\<`abi` *extends* [`Abi`](../../index/type-aliases/Abi.md) ? `abi` : [`Abi`](../../index/type-aliases/Abi.md)\[`number`\], \{ `type`: `"constructor"`; \}\>\[`"inputs"`\], `"inputs"`\> *extends* infer args ? \[`args`\] *extends* \[`never`\] ? readonly `unknown`[] : `args` : readonly `unknown`[]

Defined in: node\_modules/.pnpm/viem@2.37.9\_bufferutil@4.0.9\_typescript@5.9.2\_utf-8-validate@5.0.10\_zod@4.1.11/node\_modules/viem/\_types/types/contract.d.ts:9

## Type Parameters

### abi

`abi` *extends* [`Abi`](../../index/type-aliases/Abi.md) \| readonly `unknown`[] = [`Abi`](../../index/type-aliases/Abi.md)
