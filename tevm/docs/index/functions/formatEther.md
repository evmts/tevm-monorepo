[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / formatEther

# Function: formatEther()

> **formatEther**(`wei`, `unit`?): `string`

Converts numerical wei to a string representation of ether.

- Docs: https://viem.sh/docs/utilities/formatEther

## Parameters

• **wei**: `bigint`

• **unit?**: `"wei"` \| `"gwei"`

## Returns

`string`

## Example

```ts
import { formatEther } from 'viem'

formatEther(1000000000000000000n)
// '1'
```

## Source

node\_modules/.pnpm/viem@2.14.2\_bufferutil@4.0.8\_typescript@5.5.2\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/utils/unit/formatEther.d.ts:14
