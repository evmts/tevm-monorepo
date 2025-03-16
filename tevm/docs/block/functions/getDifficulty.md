[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [block](../README.md) / getDifficulty

# Function: getDifficulty()

> **getDifficulty**(`headerData`): `null` \| `bigint`

Defined in: packages/block/types/helpers.d.ts:38

Extracts the difficulty value from block header data

## Parameters

### headerData

[`HeaderData`](../interfaces/HeaderData.md)

The header data object to extract difficulty from

## Returns

`null` \| `bigint`

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
