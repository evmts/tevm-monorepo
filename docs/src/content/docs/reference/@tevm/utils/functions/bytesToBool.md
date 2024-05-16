---
editUrl: false
next: false
prev: false
title: "bytesToBool"
---

> **bytesToBool**(`bytes_`, `opts`?): `boolean`

Decodes a byte array into a boolean.

- Docs: https://viem.sh/docs/utilities/fromBytes#bytestobool

## Parameters

• **bytes\_**: `Uint8Array`

• **opts?**: `BytesToBoolOpts`

Options.

## Returns

`boolean`

Boolean value.

## Example

```ts
import { bytesToBool } from 'viem'
const data = bytesToBool(new Uint8Array([1]))
// true
```

## Source

node\_modules/.pnpm/viem@2.8.18\_typescript@5.4.5\_zod@3.23.8/node\_modules/viem/\_types/utils/encoding/fromBytes.d.ts:79
