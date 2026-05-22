[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / bytesToBool

# Function: bytesToBool()

> **bytesToBool**(`bytes_`, `opts?`): `boolean`

Decodes a byte array into a boolean.

- Docs: https://viem.sh/docs/utilities/fromBytes#bytestobool

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `bytes_` | `ByteArray` | - |
| `opts?` | `BytesToBoolOpts` | Options. |

## Returns

`boolean`

Boolean value.

## Example

```ts
import { bytesToBool } from 'viem'
const data = bytesToBool(new Uint8Array([1]))
// true
```
