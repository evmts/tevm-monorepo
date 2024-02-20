---
editUrl: false
next: false
prev: false
title: "hexToBool"
---

> **hexToBool**(`hex_`, `opts`?): `boolean`

Decodes a hex value into a boolean.

- Docs: https://viem.sh/docs/utilities/fromHex#hextobool

## Parameters

▪ **hex\_**: \`0x${string}\`

▪ **opts?**: `HexToBoolOpts`

Options.

## Returns

Boolean value.

## Example

```ts
import { hexToBool } from 'viem'
const data = hexToBool('0x01')
// true
```

## Example

```ts
import { hexToBool } from 'viem'
const data = hexToBool('0x0000000000000000000000000000000000000000000000000000000000000001', { size: 32 })
// true
```

## Source

node\_modules/.pnpm/viem@2.7.9\_typescript@5.3.3\_zod@3.22.4/node\_modules/viem/\_types/utils/encoding/fromHex.d.ts:99

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
