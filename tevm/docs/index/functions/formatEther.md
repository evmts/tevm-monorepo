[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / formatEther

# Function: formatEther()

> **formatEther**(`wei`, `unit?`): `string`

Defined in: tevm-monorepo/node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/utils/unit/formatEther.d.ts:14

Converts numerical wei to a string representation of ether.

- Docs: https://viem.sh/docs/utilities/formatEther

## Parameters

### wei

`bigint`

### unit?

`"wei"` \| `"gwei"`

## Returns

`string`

## Example

```ts
import { formatEther } from 'viem'

formatEther(1000000000000000000n)
// '1'
```
