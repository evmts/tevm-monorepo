[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [block](../README.md) / getDifficulty

# Function: getDifficulty()

> **getDifficulty**(`headerData`): `bigint` \| `null`

Extracts the difficulty value from block header data

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `headerData` | [`HeaderData`](../interfaces/HeaderData.md) | The header data object to extract difficulty from |

## Returns

`bigint` \| `null`

The difficulty as a bigint, or null if not present

## Example

```typescript
import { getDifficulty } from '@tevm/block'

// Get the difficulty from a block header
const difficulty = getDifficulty(blockHeader)
if (difficulty !== null) {
  console.log(`Block difficulty: ${difficulty}`)
}
```
