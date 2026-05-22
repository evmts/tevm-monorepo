[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [index](../README.md) / formatGwei

# Function: formatGwei()

> **formatGwei**(`wei`, `unit?`): `string`

Converts numerical wei to a string representation of gwei.

- Docs: https://viem.sh/docs/utilities/formatGwei

## Parameters

| Parameter | Type |
| ------ | ------ |
| `wei` | `bigint` |
| `unit?` | `"wei"` |

## Returns

`string`

## Example

```ts
import { formatGwei } from 'viem'

formatGwei(1000000000n)
// '1'
```
