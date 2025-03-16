[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / ExecutionWitnessBytes

# Type Alias: ExecutionWitnessBytes

> **ExecutionWitnessBytes**: `Uint8Array`

Defined in: [packages/block/src/types.ts:286](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L286)

Represents the serialized form of execution witness data

Used in stateless Ethereum to provide witnesses (proofs) needed for
transaction execution without requiring the full state. Contains
Verkle proofs and state differences needed to validate state transitions.

Part of Ethereum's roadmap towards statelessness with Verkle trees.

## Example

```typescript
import { ExecutionWitnessBytes, VerkleExecutionWitness } from '@tevm/block'
import { decode } from '@tevm/rlp'

// Decode execution witness from its serialized form
function decodeWitness(witnessBytes: ExecutionWitnessBytes): VerkleExecutionWitness {
  const decoded = decode(witnessBytes) as unknown[]

  // Extract the witness components (simplified example)
  return {
    stateDiff: deserializeStateDiffs(decoded[0]),
    verkleProof: deserializeVerkleProof(decoded[1])
  }
}
```
