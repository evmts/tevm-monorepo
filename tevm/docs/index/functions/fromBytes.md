[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / fromBytes

# Function: fromBytes()

> **fromBytes**\<`to`\>(`bytes`, `toOrOpts`): `FromBytesReturnType`\<`to`\>

Defined in: node\_modules/.pnpm/viem@2.23.5\_bufferutil@4.0.9\_typescript@5.8.2\_utf-8-validate@6.0.5\_zod@3.24.2/node\_modules/viem/\_types/utils/encoding/fromBytes.d.ts:37

Decodes a byte array into a UTF-8 string, hex value, number, bigint or boolean.

- Docs: https://viem.sh/docs/utilities/fromBytes
- Example: https://viem.sh/docs/utilities/fromBytes#usage

## Type Parameters

• **to** *extends* `"string"` \| `"number"` \| `"bigint"` \| `"boolean"` \| `"hex"`

## Parameters

### bytes

`ByteArray`

Byte array to decode.

### toOrOpts

`FromBytesParameters`\<`to`\>

Type to convert to or options.

## Returns

`FromBytesReturnType`\<`to`\>

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
