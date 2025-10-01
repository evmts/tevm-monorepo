[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / parseGwei

# Function: parseGwei()

> **parseGwei**(`ether`, `unit?`): `bigint`

Defined in: node\_modules/.pnpm/viem@2.37.9\_bufferutil@4.0.9\_typescript@5.9.3\_utf-8-validate@5.0.10\_zod@4.1.11/node\_modules/viem/\_types/utils/unit/parseGwei.d.ts:15

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
