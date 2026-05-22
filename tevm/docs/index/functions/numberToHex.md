[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / numberToHex

# Function: numberToHex()

> **numberToHex**(`value_`, `opts?`): `` `0x${string}` ``

Encodes a number or bigint into a hex string

- Docs: https://viem.sh/docs/utilities/toHex#numbertohex

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value_` | `number` \| `bigint` | - |
| `opts?` | `NumberToHexOpts` | Options. |

## Returns

`` `0x${string}` ``

Hex value.

## Examples

```ts
import { numberToHex } from 'viem'
const data = numberToHex(420)
// '0x1a4'
```

```ts
import { numberToHex } from 'viem'
const data = numberToHex(420, { size: 32 })
// '0x00000000000000000000000000000000000000000000000000000000000001a4'
```
