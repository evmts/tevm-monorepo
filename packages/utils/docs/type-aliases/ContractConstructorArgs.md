[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / ContractConstructorArgs

# Type Alias: ContractConstructorArgs\<abi\>

> **ContractConstructorArgs**\<`abi`\>: [`AbiParametersToPrimitiveTypes`](AbiParametersToPrimitiveTypes.md)\<`Extract`\<`abi` *extends* [`Abi`](Abi.md) ? `abi` : [`Abi`](Abi.md)\[`number`\], \{ `type`: `"constructor"`; \}\>\[`"inputs"`\], `"inputs"`\> *extends* infer args ? \[`args`\] *extends* \[`never`\] ? readonly `unknown`[] : `args` : readonly `unknown`[]

Defined in: node\_modules/.pnpm/viem@2.23.5\_bufferutil@4.0.9\_typescript@5.8.2\_utf-8-validate@6.0.5\_zod@3.24.2/node\_modules/viem/\_types/types/contract.d.ts:9

## Type Parameters

• **abi** *extends* [`Abi`](Abi.md) \| readonly `unknown`[] = [`Abi`](Abi.md)
