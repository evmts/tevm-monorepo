[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / hexToNumber

# Function: hexToNumber()

> **hexToNumber**(`hex`, `opts?`): `number`

Decodes a hex string into a number.

- Docs: https://viem.sh/docs/utilities/fromHex#hextonumber

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hex` | `` `0x${string}` `` | Hex value to decode. |
| `opts?` | `HexToBigIntOpts` | Options. |

## Returns

`number`

Number value.

## Examples

```ts
import { hexToNumber } from 'viem'
const data = hexToNumber('0x1a4')
// 420
```

```ts
import { hexToNumber } from 'viem'
const data = hexToBigInt('0x00000000000000000000000000000000000000000000000000000000000001a4', { size: 32 })
// 420
```
