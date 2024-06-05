[**@tevm/utils**](../README.md) • **Docs**

***

[@tevm/utils](../globals.md) / fromHex

# Function: fromHex()

> **fromHex**\<`TTo`\>(`hex`, `toOrOpts`): `FromHexReturnType`\<`TTo`\>

Decodes a hex string into a string, number, bigint, boolean, or byte array.

- Docs: https://viem.sh/docs/utilities/fromHex
- Example: https://viem.sh/docs/utilities/fromHex#usage

## Type parameters

• **TTo** *extends* `"string"` \| `"number"` \| `"bigint"` \| `"boolean"` \| `"bytes"`

## Parameters

• **hex**: \`0x$\{string\}\`

Hex string to decode.

• **toOrOpts**: `FromHexParameters`\<`TTo`\>

Type to convert to or options.

## Returns

`FromHexReturnType`\<`TTo`\>

Decoded value.

## Examples

```ts
import { fromHex } from 'viem'
const data = fromHex('0x1a4', 'number')
// 420
```

```ts
import { fromHex } from 'viem'
const data = fromHex('0x48656c6c6f20576f726c6421', 'string')
// 'Hello world'
```

```ts
import { fromHex } from 'viem'
const data = fromHex('0x48656c6c6f20576f726c64210000000000000000000000000000000000000000', {
  size: 32,
  to: 'string'
})
// 'Hello world'
```

## Source

node\_modules/.pnpm/viem@2.13.6\_typescript@5.4.5\_zod@3.23.8/node\_modules/viem/\_types/utils/encoding/fromHex.d.ts:47
