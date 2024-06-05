---
editUrl: false
next: false
prev: false
title: "EncodeDeployDataParameters"
---

> **EncodeDeployDataParameters**\<`abi`, `hasConstructor`, `allArgs`\>: `object` & `UnionEvaluate`\<readonly [] *extends* `allArgs` ? `object` : `object`\> & `hasConstructor` *extends* `true` ? `unknown` : `never`

## Type declaration

### abi

> **abi**: `abi`

### bytecode

> **bytecode**: [`Hex`](/reference/tevm/utils/type-aliases/hex/)

## Type parameters

• **abi** *extends* `Abi` \| readonly `unknown`[] = `Abi`

• **hasConstructor** = `abi` *extends* `Abi` ? `Abi` *extends* `abi` ? `true` : [`Extract`\<`abi`\[`number`\], `object`\>] *extends* [`never`] ? `false` : `true` : `true`

• **allArgs** = [`ContractConstructorArgs`](/reference/tevm/utils/type-aliases/contractconstructorargs/)\<`abi`\>

## Source

node\_modules/.pnpm/viem@2.13.6\_typescript@5.4.5\_zod@3.23.8/node\_modules/viem/\_types/utils/abi/encodeDeployData.d.ts:9
