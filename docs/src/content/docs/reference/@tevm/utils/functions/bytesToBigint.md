---
editUrl: false
next: false
prev: false
title: "bytesToBigint"
---

> **bytesToBigint**(`bytes`, `opts`?): `bigint`

Decodes a byte array into a bigint.

- Docs: https://viem.sh/docs/utilities/fromBytes#bytestobigint

## Parameters

▪ **bytes**: `Uint8Array`

Byte array to decode.

▪ **opts?**: `BytesToBigIntOpts`

Options.

## Returns

BigInt value.

## Example

```ts
import { bytesToBigInt } from 'viem'
const data = bytesToBigInt(new Uint8Array([1, 164]))
// 420n
```

## Source

node\_modules/.pnpm/viem@2.7.9\_typescript@5.3.3\_zod@3.22.4/node\_modules/viem/\_types/utils/encoding/fromBytes.d.ts:59

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
