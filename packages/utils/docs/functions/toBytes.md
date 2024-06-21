[**@tevm/utils**](../README.md) • **Docs**

***

[@tevm/utils](../globals.md) / toBytes

# Function: toBytes()

> **toBytes**(`value`, `opts`?): `ByteArray`

Encodes a UTF-8 string, hex value, bigint, number or boolean to a byte array.

- Docs: https://viem.sh/docs/utilities/toBytes
- Example: https://viem.sh/docs/utilities/toBytes#usage

## Parameters

• **value**: `string` \| `number` \| `bigint` \| `boolean`

Value to encode.

• **opts?**: `ToBytesParameters`

Options.

## Returns

`ByteArray`

Byte array value.

## Examples

```ts
import { toBytes } from 'viem'
const data = toBytes('Hello world')
// Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
```

```ts
import { toBytes } from 'viem'
const data = toBytes(420)
// Uint8Array([1, 164])
```

```ts
import { toBytes } from 'viem'
const data = toBytes(420, { size: 4 })
// Uint8Array([0, 0, 1, 164])
```

## Source

node\_modules/.pnpm/viem@2.14.2\_bufferutil@4.0.8\_typescript@5.5.2\_utf-8-validate@6.0.4\_zod@3.23.8/node\_modules/viem/\_types/utils/encoding/toBytes.d.ts:37
