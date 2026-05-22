[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / parseEther

# Function: parseEther()

> **parseEther**(`ether`, `unit?`): `bigint`

Converts a string representation of ether to numerical wei.

- Docs: https://viem.sh/docs/utilities/parseEther

## Parameters

| Parameter | Type |
| ------ | ------ |
| `ether` | `string` |
| `unit?` | `"wei"` \| `"gwei"` |

## Returns

`bigint`

## Example

```ts
import { parseEther } from 'viem'

parseEther('420')
// 420000000000000000000n
```
