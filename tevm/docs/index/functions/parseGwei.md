[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / parseGwei

# Function: parseGwei()

> **parseGwei**(`ether`, `unit?`): `bigint`

Converts a string representation of gwei to numerical wei.

- Docs: https://viem.sh/docs/utilities/parseGwei

## Parameters

| Parameter | Type |
| ------ | ------ |
| `ether` | `string` |
| `unit?` | `"wei"` |

## Returns

`bigint`

## Example

```ts
import { parseGwei } from 'viem'

parseGwei('420')
// 420000000000n
```
