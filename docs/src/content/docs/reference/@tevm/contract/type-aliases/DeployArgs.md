---
editUrl: false
next: false
prev: false
title: "DeployArgs"
---

> **DeployArgs**\<`THumanReadableAbi`, `TBytecode`, `TAbi`, `THasConstructor`\>: `THasConstructor` *extends* `false` ? `TBytecode` *extends* [`Hex`](/reference/tevm/utils/type-aliases/hex/) ? [] \| [`object`] : [`object`] : `TBytecode` *extends* [`Hex`](/reference/tevm/utils/type-aliases/hex/) ? [`object`] : [`object`]

Inferred arguments for a contract deployment

## Type parameters

• **THumanReadableAbi** *extends* `string`[] \| readonly `string`[]

• **TBytecode** *extends* [`Hex`](/reference/tevm/utils/type-aliases/hex/) \| `undefined` = `undefined`

• **TAbi** *extends* [`ParseAbi`](/reference/tevm/utils/type-aliases/parseabi/)\<`THumanReadableAbi`\> = [`ParseAbi`](/reference/tevm/utils/type-aliases/parseabi/)\<`THumanReadableAbi`\>

• **THasConstructor** = `TAbi` *extends* [`Abi`](/reference/tevm/utils/type-aliases/abi/) ? [`Abi`](/reference/tevm/utils/type-aliases/abi/) *extends* `TAbi` ? `true` : [`Extract`\<`TAbi`\[`number`\], `object`\>] *extends* [`never`] ? `false` : `true` : `true`

## Source

[DeployArgs.ts:6](https://github.com/evmts/tevm-monorepo/blob/main/packages/contract/src/DeployArgs.ts#L6)
