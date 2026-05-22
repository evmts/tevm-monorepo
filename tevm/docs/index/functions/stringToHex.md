[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / stringToHex

# Function: stringToHex()

> **stringToHex**(`value_`, `opts?`): `` `0x${string}` ``

Encodes a UTF-8 string into a hex string

- Docs: https://viem.sh/docs/utilities/toHex#stringtohex

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value_` | `string` | - |
| `opts?` | `StringToHexOpts` | Options. |

## Returns

`` `0x${string}` ``

Hex value.

## Examples

```ts
import { stringToHex } from 'viem'
const data = stringToHex('Hello World!')
// '0x48656c6c6f20576f726c6421'
```

```ts
import { stringToHex } from 'viem'
const data = stringToHex('Hello World!', { size: 32 })
// '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
```
