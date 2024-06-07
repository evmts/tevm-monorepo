[**@tevm/utils**](../README.md) • **Docs**

***

[@tevm/utils](../globals.md) / hexToString

# Function: hexToString()

> **hexToString**(`hex`, `opts`?): `string`

Decodes a hex value into a UTF-8 string.

- Docs: https://viem.sh/docs/utilities/fromHex#hextostring

## Parameters

• **hex**: \`0x$\{string\}\`

Hex value to decode.

• **opts?**: `HexToStringOpts`

Options.

## Returns

`string`

String value.

## Examples

```ts
import { hexToString } from 'viem'
const data = hexToString('0x48656c6c6f20576f726c6421')
// 'Hello world!'
```

```ts
import { hexToString } from 'viem'
const data = hexToString('0x48656c6c6f20576f726c64210000000000000000000000000000000000000000', {
 size: 32,
})
// 'Hello world'
```

## Source

node\_modules/.pnpm/viem@2.13.6\_bufferutil@4.0.8\_typescript@5.4.5\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/utils/encoding/fromHex.d.ts:148
