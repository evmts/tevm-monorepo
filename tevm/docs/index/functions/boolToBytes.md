[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / boolToBytes

# Function: boolToBytes()

> **boolToBytes**(`value`, `opts?`): `ByteArray`

Encodes a boolean into a byte array.

- Docs: https://viem.sh/docs/utilities/toBytes#booltobytes

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Boolean value to encode. |
| `opts?` | `BoolToBytesOpts` | Options. |

## Returns

`ByteArray`

Byte array value.

## Examples

```ts
import { boolToBytes } from 'viem'
const data = boolToBytes(true)
// Uint8Array([1])
```

```ts
import { boolToBytes } from 'viem'
const data = boolToBytes(true, { size: 32 })
// Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1])
```
