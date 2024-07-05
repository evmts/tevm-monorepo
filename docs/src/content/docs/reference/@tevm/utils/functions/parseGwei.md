---
editUrl: false
next: false
prev: false
title: "parseGwei"
---

> **parseGwei**(`ether`, `unit`?): `bigint`

Converts a string representation of gwei to numerical wei.

- Docs: https://viem.sh/docs/utilities/parseGwei

## Parameters

• **ether**: `string`

• **unit?**: `"wei"`

## Returns

`bigint`

## Example

```ts
import { parseGwei } from 'viem'

parseGwei('420')
// 420000000000n
```

## Defined in

node\_modules/.pnpm/viem@2.14.2\_bufferutil@4.0.8\_typescript@5.5.3\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/utils/unit/parseGwei.d.ts:15
