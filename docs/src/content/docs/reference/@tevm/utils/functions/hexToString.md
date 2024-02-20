---
editUrl: false
next: false
prev: false
title: "hexToString"
---

> **hexToString**(`hex`, `opts`?): `string`

Decodes a hex value into a UTF-8 string.

- Docs: https://viem.sh/docs/utilities/fromHex#hextostring

## Parameters

▪ **hex**: \`0x${string}\`

Hex value to decode.

▪ **opts?**: `HexToStringOpts`

Options.

## Returns

String value.

## Example

```ts
import { hexToString } from 'viem'
const data = hexToString('0x48656c6c6f20576f726c6421')
// 'Hello world!'
```

## Example

```ts
import { hexToString } from 'viem'
const data = hexToString('0x48656c6c6f20576f726c64210000000000000000000000000000000000000000', {
 size: 32,
})
// 'Hello world'
```

## Source

node\_modules/.pnpm/viem@2.7.9\_typescript@5.3.3\_zod@3.22.4/node\_modules/viem/\_types/utils/encoding/fromHex.d.ts:148

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
