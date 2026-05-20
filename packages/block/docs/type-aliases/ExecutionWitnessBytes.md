[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / ExecutionWitnessBytes

# Type Alias: ExecutionWitnessBytes

> **ExecutionWitnessBytes** = `Uint8Array`

Defined in: [packages/block/src/types.ts:286](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L286)

Represents the serialized form of execution witness payload data.

Used by upstream stateless Ethereum specs to provide witnesses (proofs).
Tevm models this serialized shape but does not execute or verify
Verkle/EIP-6800 state-witness blocks.

## Example

```typescript
import { ExecutionWitnessBytes, VerkleExecutionWitness } from '@tevm/block'
import { decode } from '@evmts/zevm/rlp'

// Decode execution witness from its serialized form for a downstream verifier.
function decodeWitness(witnessBytes: ExecutionWitnessBytes): VerkleExecutionWitness {
  const decoded = decode(witnessBytes) as unknown[]

  // Extract the witness components (simplified example)
  return {
    stateDiff: deserializeStateDiffs(decoded[0]),
    verkleProof: deserializeVerkleProof(decoded[1])
  }
}
```
