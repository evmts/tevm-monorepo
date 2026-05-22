[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / toBytes

# Function: toBytes()

> **toBytes**(`value`, `opts?`): `ByteArray`

Encodes a UTF-8 string, hex value, bigint, number or boolean to a byte array.

- Docs: https://viem.sh/docs/utilities/toBytes
- Example: https://viem.sh/docs/utilities/toBytes#usage

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` \| `bigint` \| `boolean` | Value to encode. |
| `opts?` | `ToBytesParameters` | Options. |

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
