[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [index](../README.md) / formatGwei

# Function: formatGwei()

> **formatGwei**(`wei`, `unit`?): `string`

Converts numerical wei to a string representation of gwei.

- Docs: https://viem.sh/docs/utilities/formatGwei

## Parameters

• **wei**: `bigint`

• **unit?**: `"wei"`

## Returns

`string`

## Example

```ts
import { formatGwei } from 'viem'

formatGwei(1000000000n)
// '1'
```

## Source

node\_modules/.pnpm/viem@2.14.2\_bufferutil@4.0.8\_typescript@5.4.5\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/utils/unit/formatGwei.d.ts:14
