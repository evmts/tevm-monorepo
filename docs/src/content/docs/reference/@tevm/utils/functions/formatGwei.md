---
editUrl: false
next: false
prev: false
title: "formatGwei"
---

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

## Defined in

node\_modules/.pnpm/viem@2.21.1\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/utils/unit/formatGwei.d.ts:14
