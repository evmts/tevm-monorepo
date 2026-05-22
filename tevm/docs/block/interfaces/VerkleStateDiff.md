[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [block](../README.md) / VerkleStateDiff

# Interface: VerkleStateDiff

Represents the state differences payload shape for a Verkle tree.

Used to describe state changes between blocks in a more efficient way than
recording the entire state. Contains a mapping of stems (path prefixes) to
their corresponding state changes, along with proofs to verify these changes.

Tevm models this payload shape but does not execute or verify Verkle/EIP-6800
state-witness blocks.

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

| Property | Type |
| ------ | ------ |
| <a id="stem"></a> `stem` | `` `0x${string}` `` |
| <a id="suffixdiffs"></a> `suffixDiffs` | `object`[] |
