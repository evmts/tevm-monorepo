---
editUrl: false
next: false
prev: false
title: "parseEther"
---

> **parseEther**(`ether`, `unit`?): `bigint`

Converts a string representation of ether to numerical wei.

- Docs: https://viem.sh/docs/utilities/parseEther

## Parameters

• **ether**: `string`

• **unit?**: `"wei"` \| `"gwei"`

## Returns

`bigint`

## Example

```ts
import { parseEther } from 'viem'

parseEther('420')
// 420000000000000000000n
```

## Defined in

node\_modules/.pnpm/viem@2.14.2\_bufferutil@4.0.8\_typescript@5.5.2\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/utils/unit/parseEther.d.ts:15
