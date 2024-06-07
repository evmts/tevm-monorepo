[**@tevm/utils**](../README.md) • **Docs**

***

[@tevm/utils](../globals.md) / EncodeDeployDataParameters

# Type alias: EncodeDeployDataParameters\<abi, hasConstructor, allArgs\>

> **EncodeDeployDataParameters**\<`abi`, `hasConstructor`, `allArgs`\>: `object` & `UnionEvaluate`\<readonly [] *extends* `allArgs` ? `object` : `object`\> & `hasConstructor` *extends* `true` ? `unknown` : `never`

## Type declaration

### abi

> **abi**: `abi`

### bytecode

> **bytecode**: [`Hex`](Hex.md)

## Type parameters

• **abi** *extends* `Abi` \| readonly `unknown`[] = `Abi`

• **hasConstructor** = `abi` *extends* `Abi` ? `Abi` *extends* `abi` ? `true` : [`Extract`\<`abi`\[`number`\], `object`\>] *extends* [`never`] ? `false` : `true` : `true`

• **allArgs** = [`ContractConstructorArgs`](ContractConstructorArgs.md)\<`abi`\>

## Source

node\_modules/.pnpm/viem@2.13.6\_bufferutil@4.0.8\_typescript@5.4.5\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/utils/abi/encodeDeployData.d.ts:9
