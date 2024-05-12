**@tevm/utils** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > EncodeDeployDataParameters

# Type alias: EncodeDeployDataParameters`<abi, hasConstructor, allArgs>`

> **EncodeDeployDataParameters**\<`abi`, `hasConstructor`, `allArgs`\>: `object` & `UnionEvaluate`\<readonly [] extends `allArgs` ? `object` : `object`\> & `hasConstructor` extends `true` ? `unknown` : `never`

## Type declaration

### abi

> **abi**: `abi`

### bytecode

> **bytecode**: [`Hex`](Hex.md)

## Type parameters

| Parameter | Default |
| :------ | :------ |
| `abi` extends `Abi` \| readonly `unknown`[] | `Abi` |
| `hasConstructor` | `abi` extends `Abi` ? `Abi` extends `abi` ? `true` : [`Extract`\<`abi`[`number`], `object`\>] extends [`never`] ? `false` : `true` : `true` |
| `allArgs` | [`ContractConstructorArgs`](ContractConstructorArgs.md)\<`abi`\> |

## Source

node\_modules/.pnpm/viem@2.8.18\_typescript@5.4.5\_zod@3.23.4/node\_modules/viem/\_types/utils/abi/encodeDeployData.d.ts:9

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
