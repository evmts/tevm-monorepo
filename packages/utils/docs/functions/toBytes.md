[**@tevm/utils**](../README.md)

***

[@tevm/utils](../globals.md) / toBytes

# Function: toBytes()

> **toBytes**(`value`, `opts?`): `ByteArray`

Defined in: node\_modules/.pnpm/viem@2.37.8\_bufferutil@4.0.9\_typescript@5.8.3\_utf-8-validate@5.0.10\_zod@3.25.30/node\_modules/viem/\_types/utils/encoding/toBytes.d.ts:37

Encodes a UTF-8 string, hex value, bigint, number or boolean to a byte array.

- Docs: https://viem.sh/docs/utilities/toBytes
- Example: https://viem.sh/docs/utilities/toBytes#usage

## Parameters

### value

Value to encode.

`string` | `number` | `bigint` | `boolean`

### opts?

`ToBytesParameters`

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
