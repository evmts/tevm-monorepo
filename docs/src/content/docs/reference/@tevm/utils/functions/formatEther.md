---
editUrl: false
next: false
prev: false
title: "formatEther"
---

> **formatEther**(`wei`, `unit`?): `string`

Converts numerical wei to a string representation of ether.

- Docs: https://viem.sh/docs/utilities/formatEther

## Parameters

▪ **wei**: `bigint`

▪ **unit?**: `"wei"` \| `"gwei"`

## Returns

## Example

```ts
import { formatEther } from 'viem'

formatEther(1000000000000000000n)
// '1'
```

## Source

node\_modules/.pnpm/viem@2.7.9\_typescript@5.3.3\_zod@3.22.4/node\_modules/viem/\_types/utils/unit/formatEther.d.ts:14

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
