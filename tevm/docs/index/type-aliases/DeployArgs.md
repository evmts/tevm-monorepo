[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / DeployArgs

# Type Alias: DeployArgs\<THumanReadableAbi, TBytecode, TAbi, THasConstructor\>

> **DeployArgs**\<`THumanReadableAbi`, `TBytecode`, `TAbi`, `THasConstructor`\>: `THasConstructor` *extends* `false` ? `TBytecode` *extends* [`Hex`](Hex.md) ? [] \| [`object`] : [`object`] : `TBytecode` *extends* [`Hex`](Hex.md) ? [`object`] : [`object`]

Inferred arguments for a contract deployment

## Type Parameters

• **THumanReadableAbi** *extends* `string`[] \| readonly `string`[]

• **TBytecode** *extends* [`Hex`](Hex.md) \| `undefined` = `undefined`

• **TAbi** *extends* [`ParseAbi`](ParseAbi.md)\<`THumanReadableAbi`\> = [`ParseAbi`](ParseAbi.md)\<`THumanReadableAbi`\>

• **THasConstructor** = `TAbi` *extends* [`Abi`](Abi.md) ? [`Abi`](Abi.md) *extends* `TAbi` ? `true` : [`Extract`\<`TAbi`\[`number`\], `object`\>] *extends* [`never`] ? `false` : `true` : `true`

## Defined in

packages/contract/types/DeployArgs.d.ts:5
