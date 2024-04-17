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

• **hex**: ```0x${string}```

Hex value to decode.

• **opts?**: `HexToStringOpts`

Options.

## Returns

`string`

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

node\_modules/.pnpm/viem@2.8.18\_typescript@5.4.5/node\_modules/viem/\_types/utils/encoding/fromHex.d.ts:148
