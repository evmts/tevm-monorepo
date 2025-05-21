[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / parseGwei

# Function: parseGwei()

> **parseGwei**(`ether`, `unit?`): `bigint`

Defined in: node\_modules/.pnpm/viem@2.23.10\_bufferutil@4.0.9\_typescript@5.8.3\_utf-8-validate@5.0.10\_zod@3.24.4/node\_modules/viem/\_types/utils/unit/parseGwei.d.ts:15

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
