[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [utils](../README.md) / EncodeDeployDataParameters

# Type Alias: EncodeDeployDataParameters\<abi, hasConstructor, allArgs\>

> **EncodeDeployDataParameters**\<`abi`, `hasConstructor`, `allArgs`\> = `object` & `UnionEvaluate`\<`hasConstructor` *extends* `false` ? `object` : readonly \[\] *extends* `allArgs` ? `object` : `object`\>

Defined in: node\_modules/.pnpm/viem@2.30.1\_bufferutil@4.0.9\_typescript@5.8.3\_utf-8-validate@5.0.10\_zod@3.25.28/node\_modules/viem/\_types/utils/abi/encodeDeployData.d.ts:9

## Type declaration

### abi

> **abi**: `abi`

### bytecode

> **bytecode**: [`Hex`](../../index/type-aliases/Hex.md)

## Type Parameters

### abi

`abi` *extends* [`Abi`](../../index/type-aliases/Abi.md) \| readonly `unknown`[] = [`Abi`](../../index/type-aliases/Abi.md)

### hasConstructor

`hasConstructor` = `abi` *extends* [`Abi`](../../index/type-aliases/Abi.md) ? [`Abi`](../../index/type-aliases/Abi.md) *extends* `abi` ? `true` : \[`Extract`\<`abi`\[`number`\], \{ `type`: `"constructor"`; \}\>\] *extends* \[`never`\] ? `false` : `true` : `true`

### allArgs

`allArgs` = [`ContractConstructorArgs`](ContractConstructorArgs.md)\<`abi`\>
