[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / bytesToNumber

# Function: bytesToNumber()

> **bytesToNumber**(`bytes`, `opts?`): `number`

Decodes a byte array into a number.

- Docs: https://viem.sh/docs/utilities/fromBytes#bytestonumber

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `bytes` | `ByteArray` | Byte array to decode. |
| `opts?` | `BytesToBigIntOpts` | Options. |

## Returns

`number`

Number value.

## Example

```ts
import { bytesToNumber } from 'viem'
const data = bytesToNumber(new Uint8Array([1, 164]))
// 420
```
