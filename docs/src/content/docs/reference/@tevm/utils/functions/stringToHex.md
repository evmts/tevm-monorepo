---
editUrl: false
next: false
prev: false
title: "stringToHex"
---

> **stringToHex**(`value_`, `opts`?): [`Hex`](/reference/tevm/utils/type-aliases/hex/)

Encodes a UTF-8 string into a hex string

- Docs: https://viem.sh/docs/utilities/toHex#stringtohex

## Parameters

▪ **value\_**: `string`

▪ **opts?**: `StringToHexOpts`

Options.

## Returns

Hex value.

## Example

```ts
import { stringToHex } from 'viem'
const data = stringToHex('Hello World!')
// '0x48656c6c6f20576f726c6421'
```

## Example

```ts
import { stringToHex } from 'viem'
const data = stringToHex('Hello World!', { size: 32 })
// '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
```

## Source

node\_modules/.pnpm/viem@2.7.9\_typescript@5.3.3\_zod@3.22.4/node\_modules/viem/\_types/utils/encoding/toHex.d.ts:147

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
