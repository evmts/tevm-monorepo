[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [utils](../README.md) / ContractConstructorArgs

# Type alias: ContractConstructorArgs\<abi\>

> **ContractConstructorArgs**\<`abi`\>: `AbiParametersToPrimitiveTypes`\<`Extract`\<`abi` *extends* `Abi` ? `abi` : `Abi`\[`number`\], `object`\>\[`"inputs"`\], `"inputs"`\> *extends* infer args ? [`args`] *extends* [`never`] ? readonly `unknown`[] : `args` : readonly `unknown`[]

## Type parameters

• **abi** *extends* `Abi` \| readonly `unknown`[] = `Abi`

## Source

node\_modules/.pnpm/viem@2.8.18\_typescript@5.4.5\_zod@3.23.8/node\_modules/viem/\_types/types/contract.d.ts:9
