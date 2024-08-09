---
editUrl: false
next: false
prev: false
title: "bytesToNumber"
---

> **bytesToNumber**(`bytes`, `opts`?): `number`

Decodes a byte array into a number.

- Docs: https://viem.sh/docs/utilities/fromBytes#bytestonumber

## Parameters

• **bytes**: `Uint8Array`

Byte array to decode.

• **opts?**: `BytesToBigIntOpts`

Options.

## Returns

`number`

Number value.

## Example

```ts
import { bytesToNumber } from 'viem'
const data = bytesToNumber(new Uint8Array([1, 164]))
// 420
```

## Defined in

node\_modules/.pnpm/viem@2.14.2\_bufferutil@4.0.8\_typescript@5.5.4\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/utils/encoding/fromBytes.d.ts:96
