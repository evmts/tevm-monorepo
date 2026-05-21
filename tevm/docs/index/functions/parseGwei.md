[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / parseGwei

# Function: parseGwei()

> **parseGwei**(`ether`, `unit?`): `bigint`

Defined in: tevm-monorepo/node\_modules/.pnpm/viem@2.49.3\_bufferutil@4.1.0\_typescript@6.0.3\_utf-8-validate@5.0.10\_zod@4.4.3/node\_modules/viem/\_types/utils/unit/parseGwei.d.ts:15

Converts a string representation of gwei to numerical wei.

- Docs: https://viem.sh/docs/utilities/parseGwei

## Parameters

### ether

`string`

### unit?

`"wei"`

## Returns

`bigint`

## Example

```ts
import { parseGwei } from 'viem'

parseGwei('420')
// 420000000000n
```
