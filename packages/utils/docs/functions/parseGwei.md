[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / parseGwei

# Function: parseGwei()

> **parseGwei**(`ether`, `unit`?): `bigint`

Defined in: node\_modules/.pnpm/viem@2.23.5\_bufferutil@4.0.9\_typescript@5.8.2\_utf-8-validate@6.0.5\_zod@3.24.2/node\_modules/viem/\_types/utils/unit/parseGwei.d.ts:15

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
