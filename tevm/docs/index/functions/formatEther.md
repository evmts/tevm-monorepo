[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / formatEther

# Function: formatEther()

> **formatEther**(`wei`, `unit?`): `string`

Converts numerical wei to a string representation of ether.

- Docs: https://viem.sh/docs/utilities/formatEther

## Parameters

| Parameter | Type |
| ------ | ------ |
| `wei` | `bigint` |
| `unit?` | `"wei"` \| `"gwei"` |

## Returns

`string`

## Example

```ts
import { formatEther } from 'viem'

formatEther(1000000000000000000n)
// '1'
```
