[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / toHex

# Function: toHex()

> **toHex**(`value`, `opts?`): `` `0x${string}` ``

Encodes a string, number, bigint, or ByteArray into a hex string

- Docs: https://viem.sh/docs/utilities/toHex
- Example: https://viem.sh/docs/utilities/toHex#usage

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` \| `bigint` \| `boolean` \| `ByteArray` | Value to encode. |
| `opts?` | `ToHexParameters` | Options. |

## Returns

`` `0x${string}` ``

Hex value.

## Examples

```ts
import { toHex } from 'viem'
const data = toHex('Hello world')
// '0x48656c6c6f20776f726c6421'
```

```ts
import { toHex } from 'viem'
const data = toHex(420)
// '0x1a4'
```

```ts
import { toHex } from 'viem'
const data = toHex('Hello world', { size: 32 })
// '0x48656c6c6f20776f726c64210000000000000000000000000000000000000000'
```
