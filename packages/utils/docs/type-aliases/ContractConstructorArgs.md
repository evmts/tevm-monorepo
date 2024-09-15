[**@tevm/utils**](../README.md) • **Docs**

***

[@tevm/utils](../globals.md) / ContractConstructorArgs

# Type Alias: ContractConstructorArgs\<abi\>

> **ContractConstructorArgs**\<`abi`\>: `AbiParametersToPrimitiveTypes`\<`Extract`\<`abi` *extends* `Abi` ? `abi` : `Abi`\[`number`\], `object`\>\[`"inputs"`\], `"inputs"`\> *extends* infer args ? [`args`] *extends* [`never`] ? readonly `unknown`[] : `args` : readonly `unknown`[]

## Type Parameters

• **abi** *extends* `Abi` \| readonly `unknown`[] = `Abi`

## Defined in

node\_modules/.pnpm/viem@2.21.7\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/types/contract.d.ts:9
