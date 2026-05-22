[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / formatGwei

# Function: formatGwei()

> **formatGwei**(`wei`, `unit?`): `string`

Defined in: tevm-monorepo/node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/utils/unit/formatGwei.d.ts:14

Converts numerical wei to a string representation of gwei.

- Docs: https://viem.sh/docs/utilities/formatGwei

## Parameters

| Parameter | Type |
| ------ | ------ |
| `wei` | `bigint` |
| `unit?` | `"wei"` |

## Returns

`string`

## Example

```ts
import { formatGwei } from 'viem'

formatGwei(1000000000n)
// '1'
```
