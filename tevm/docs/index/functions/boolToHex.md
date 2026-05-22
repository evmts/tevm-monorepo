[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / boolToHex

# Function: boolToHex()

> **boolToHex**(`value`, `opts?`): `` `0x${string}` ``

Encodes a boolean into a hex string

- Docs: https://viem.sh/docs/utilities/toHex#booltohex

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Value to encode. |
| `opts?` | `BoolToHexOpts` | Options. |

## Returns

`` `0x${string}` ``

Hex value.

## Examples

```ts
import { boolToHex } from 'viem'
const data = boolToHex(true)
// '0x1'
```

```ts
import { boolToHex } from 'viem'
const data = boolToHex(false)
// '0x0'
```

```ts
import { boolToHex } from 'viem'
const data = boolToHex(true, { size: 32 })
// '0x0000000000000000000000000000000000000000000000000000000000000001'
```
