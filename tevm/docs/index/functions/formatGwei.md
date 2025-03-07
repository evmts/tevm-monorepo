[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / formatGwei

# Function: formatGwei()

> **formatGwei**(`wei`, `unit`?): `string`

Defined in: node\_modules/.pnpm/viem@2.23.5\_bufferutil@4.0.9\_typescript@5.8.2\_utf-8-validate@6.0.5\_zod@3.24.2/node\_modules/viem/\_types/utils/unit/formatGwei.d.ts:14

Converts numerical wei to a string representation of gwei.

- Docs: https://viem.sh/docs/utilities/formatGwei

## Parameters

### wei

`bigint`

### unit?

`"wei"`

## Returns

`string`

## Example

```ts
import { formatGwei } from 'viem'

formatGwei(1000000000n)
// '1'
```
