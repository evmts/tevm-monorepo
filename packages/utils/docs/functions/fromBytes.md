[**@tevm/utils**](../README.md) • **Docs**

***

[@tevm/utils](../globals.md) / fromBytes

# Function: fromBytes()

> **fromBytes**\<`TTo`\>(`bytes`, `toOrOpts`): `FromBytesReturnType`\<`TTo`\>

Decodes a byte array into a UTF-8 string, hex value, number, bigint or boolean.

- Docs: https://viem.sh/docs/utilities/fromBytes
- Example: https://viem.sh/docs/utilities/fromBytes#usage

## Type Parameters

• **TTo** *extends* `"string"` \| `"number"` \| `"bigint"` \| `"boolean"` \| `"hex"`

## Parameters

• **bytes**: `Uint8Array`

Byte array to decode.

• **toOrOpts**: `FromBytesParameters`\<`TTo`\>

Type to convert to or options.

## Returns

`FromBytesReturnType`\<`TTo`\>

Decoded value.

## Examples

```ts
import { fromBytes } from 'viem'
const data = fromBytes(new Uint8Array([1, 164]), 'number')
// 420
```

```ts
import { fromBytes } from 'viem'
const data = fromBytes(
  new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]),
  'string'
)
// 'Hello world'
```

## Defined in

node\_modules/.pnpm/viem@2.14.2\_bufferutil@4.0.8\_typescript@5.5.3\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/utils/encoding/fromBytes.d.ts:37
