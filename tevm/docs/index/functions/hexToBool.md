[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / hexToBool

# Function: hexToBool()

> **hexToBool**(`hex_`, `opts?`): `boolean`

Decodes a hex value into a boolean.

- Docs: https://viem.sh/docs/utilities/fromHex#hextobool

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hex_` | `` `0x${string}` `` | - |
| `opts?` | `HexToBoolOpts` | Options. |

## Returns

`boolean`

Boolean value.

## Examples

```ts
import { hexToBool } from 'viem'
const data = hexToBool('0x01')
// true
```

```ts
import { hexToBool } from 'viem'
const data = hexToBool('0x0000000000000000000000000000000000000000000000000000000000000001', { size: 32 })
// true
```
