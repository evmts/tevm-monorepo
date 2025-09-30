[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / EncodeDeployDataParameters

# Type Alias: EncodeDeployDataParameters\<abi, hasConstructor, allArgs\>

> **EncodeDeployDataParameters**\<`abi`, `hasConstructor`, `allArgs`\> = `object` & `UnionEvaluate`\<`hasConstructor` *extends* `false` ? `object` : readonly \[\] *extends* `allArgs` ? `object` : `object`\>

Defined in: node\_modules/.pnpm/viem@2.37.9\_bufferutil@4.0.9\_typescript@5.9.2\_utf-8-validate@5.0.10\_zod@4.1.11/node\_modules/viem/\_types/utils/abi/encodeDeployData.d.ts:9

## Type Declaration

### abi

> **abi**: `abi`

### bytecode

> **bytecode**: [`Hex`](Hex.md)

## Type Parameters

### abi

`abi` *extends* [`Abi`](Abi.md) \| readonly `unknown`[] = [`Abi`](Abi.md)

### hasConstructor

`hasConstructor` = `abi` *extends* [`Abi`](Abi.md) ? [`Abi`](Abi.md) *extends* `abi` ? `true` : \[`Extract`\<`abi`\[`number`\], \{ `type`: `"constructor"`; \}\>\] *extends* \[`never`\] ? `false` : `true` : `true`

### allArgs

`allArgs` = [`ContractConstructorArgs`](ContractConstructorArgs.md)\<`abi`\>
