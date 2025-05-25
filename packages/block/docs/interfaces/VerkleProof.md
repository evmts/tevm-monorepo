[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / VerkleProof

# Interface: VerkleProof

Defined in: packages/block/src/types.ts:89

Represents a Verkle proof used for state verification

Verkle trees are an upgrade to Merkle Patricia trees that use vector commitments
instead of hash-based commitments, resulting in smaller proof sizes.
This interface contains the elements needed for Verkle proof verification.

## See

https://eips.ethereum.org/EIPS/eip-6800 for more details on Verkle trees in Ethereum

## Example

```typescript
import { VerkleProof } from '@tevm/block'

// Example of verifying a Verkle proof
function verifyProof(proof: VerkleProof, key: Hex, value: Hex, commitment: Hex): boolean {
  // Verkle proof verification implementation would go here
  return true
}
```

## Properties

### commitmentsByPath

> **commitmentsByPath**: `` `0x${string}` ``[]

Defined in: packages/block/src/types.ts:90

***

### d

> **d**: `` `0x${string}` ``

Defined in: packages/block/src/types.ts:91

***

### depthExtensionPresent

> **depthExtensionPresent**: `` `0x${string}` ``

Defined in: packages/block/src/types.ts:92

***

### ipaProof

> **ipaProof**: `object`

Defined in: packages/block/src/types.ts:93

#### cl

> **cl**: `` `0x${string}` ``[]

#### cr

> **cr**: `` `0x${string}` ``[]

#### finalEvaluation

> **finalEvaluation**: `` `0x${string}` ``

***

### otherStems

> **otherStems**: `` `0x${string}` ``[]

Defined in: packages/block/src/types.ts:98
