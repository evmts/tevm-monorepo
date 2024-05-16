[**@tevm/utils**](../README.md) • **Docs**

***

[@tevm/utils](../globals.md) / parseEther

# Function: parseEther()

> **parseEther**(`ether`, `unit`?): `bigint`

Converts a string representation of ether to numerical wei.

- Docs: https://viem.sh/docs/utilities/parseEther

## Parameters

• **ether**: `string`

• **unit?**: `"wei"` \| `"gwei"`

## Returns

`bigint`

## Example

```ts
import { parseEther } from 'viem'

parseEther('420')
// 420000000000000000000n
```

## Source

node\_modules/.pnpm/viem@2.8.18\_typescript@5.4.5\_zod@3.23.8/node\_modules/viem/\_types/utils/unit/parseEther.d.ts:15
