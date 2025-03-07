[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / formatEther

# Function: formatEther()

> **formatEther**(`wei`, `unit`?): `string`

Defined in: node\_modules/.pnpm/viem@2.23.5\_bufferutil@4.0.9\_typescript@5.8.2\_utf-8-validate@6.0.5\_zod@3.24.2/node\_modules/viem/\_types/utils/unit/formatEther.d.ts:14

Converts numerical wei to a string representation of ether.

- Docs: https://viem.sh/docs/utilities/formatEther

## Parameters

### wei

`bigint`

### unit?

`"wei"` | `"gwei"`

## Returns

`string`

## Example

```ts
import { formatEther } from 'viem'

formatEther(1000000000000000000n)
// '1'
```
