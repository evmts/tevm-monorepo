**tevm** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [index](../README.md) > parseEther

# Function: parseEther()

> **parseEther**(`ether`, `unit`?): `bigint`

Converts a string representation of ether to numerical wei.

- Docs: https://viem.sh/docs/utilities/parseEther

## Parameters

▪ **ether**: `string`

▪ **unit?**: `"wei"` \| `"gwei"`

## Returns

## Example

```ts
import { parseEther } from 'viem'

parseEther('420')
// 420000000000000000000n
```

## Source

node\_modules/.pnpm/viem@2.8.18\_typescript@5.4.5\_zod@3.22.5/node\_modules/viem/\_types/utils/unit/parseEther.d.ts:15

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
