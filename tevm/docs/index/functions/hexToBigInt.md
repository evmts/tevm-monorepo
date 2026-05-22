[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / hexToBigInt

# Function: hexToBigInt()

> **hexToBigInt**(`hex`, `opts?`): `bigint`

Decodes a hex value into a bigint.

- Docs: https://viem.sh/docs/utilities/fromHex#hextobigint

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hex` | `` `0x${string}` `` | Hex value to decode. |
| `opts?` | `HexToBigIntOpts` | Options. |

## Returns

`bigint`

BigInt value.

## Examples

```ts
import { hexToBigInt } from 'viem'
const data = hexToBigInt('0x1a4', { signed: true })
// 420n
```

```ts
import { hexToBigInt } from 'viem'
const data = hexToBigInt('0x00000000000000000000000000000000000000000000000000000000000001a4', { size: 32 })
// 420n
```
