[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [utils](../README.md) / EncodeDeployDataParameters

# Type Alias: EncodeDeployDataParameters\<abi, hasConstructor, allArgs\>

> **EncodeDeployDataParameters**\<`abi`, `hasConstructor`, `allArgs`\> = `object` & `UnionEvaluate`\<`hasConstructor` *extends* `false` ? `object` : readonly \[\] *extends* `allArgs` ? `object` : `object`\>

## Type Declaration

### abi

> **abi**: `abi`

### bytecode

> **bytecode**: [`Hex`](../../index/type-aliases/Hex.md)

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `abi` *extends* [`Abi`](../../index/type-aliases/Abi.md) \| readonly `unknown`[] | [`Abi`](../../index/type-aliases/Abi.md) |
| `hasConstructor` | `abi` *extends* [`Abi`](../../index/type-aliases/Abi.md) ? [`Abi`](../../index/type-aliases/Abi.md) *extends* `abi` ? `true` : \[`Extract`\<`abi`\[`number`\], \{ `type`: `"constructor"`; \}\>\] *extends* \[`never`\] ? `false` : `true` : `true` |
| `allArgs` | [`ContractConstructorArgs`](ContractConstructorArgs.md)\<`abi`\> |
