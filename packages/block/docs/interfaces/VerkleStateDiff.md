[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / VerkleStateDiff

# Interface: VerkleStateDiff

Defined in: [packages/block/src/types.ts:135](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L135)

Represents the state differences in a Verkle tree between two states

Used to describe state changes between blocks in a more efficient way than
recording the entire state. Contains a mapping of stems (path prefixes) to
their corresponding state changes, along with proofs to verify these changes.

Part of Ethereum's statelessness roadmap, enabling clients to validate blocks
without storing the entire state.

## Example

```typescript
import { VerkleStateDiff } from '@tevm/block'

// Example of applying state changes from a diff
function applyStateDiff(currentState: Map<string, Hex>, diff: VerkleStateDiff): Map<string, Hex> {
  const updatedState = new Map(currentState)

  // Apply each change from the state diff
  for (const [stem, changes] of Object.entries(diff.stateDiff)) {
    for (const [key, value] of Object.entries(changes)) {
      const fullKey = stem + key
      if (value === null) {
        updatedState.delete(fullKey)
      } else {
        updatedState.set(fullKey, value)
      }
    }
  }

  return updatedState
}
```

## Properties

### stem

> **stem**: `` `0x${string}` ``

Defined in: [packages/block/src/types.ts:136](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L136)

***

### suffixDiffs

> **suffixDiffs**: `object`[]

Defined in: [packages/block/src/types.ts:137](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L137)

#### currentValue

> **currentValue**: `null` \| `` `0x${string}` ``

#### newValue

> **newValue**: `null` \| `` `0x${string}` ``

#### suffix

> **suffix**: `string` \| `number`
