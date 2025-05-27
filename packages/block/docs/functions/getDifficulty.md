[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / getDifficulty

# Function: getDifficulty()

> **getDifficulty**(`headerData`): `null` \| `bigint`

Defined in: [packages/block/src/helpers.ts:110](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/helpers.ts#L110)

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
