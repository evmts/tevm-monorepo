[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [block](../README.md) / VerkleProof

# Interface: VerkleProof

Represents a Verkle proof payload shape used by upstream specs.

Verkle trees are an upgrade to Merkle Patricia tries that use vector commitments
instead of hash-based commitments, resulting in smaller proof sizes.
Tevm models this payload shape but does not execute or verify Verkle/EIP-6800
state-witness blocks.

## See

https://eips.ethereum.org/EIPS/eip-6800 for more details on Verkle trees in Ethereum

## Example

```typescript
import { VerkleProof } from '@tevm/block'

// Example shape for a downstream verifier.
function verifyProof(proof: VerkleProof, key: Hex, value: Hex, commitment: Hex): boolean {
  // Verkle proof verification is intentionally outside Tevm's execution path.
  return true
}
```

## Properties

| Property | Type |
| ------ | ------ |
| <a id="commitmentsbypath"></a> `commitmentsByPath` | `` `0x${string}` ``[] |
| <a id="d"></a> `d` | `` `0x${string}` `` |
| <a id="depthextensionpresent"></a> `depthExtensionPresent` | `` `0x${string}` `` |
| <a id="ipaproof"></a> `ipaProof` | `object` |
| `ipaProof.cl` | `` `0x${string}` ``[] |
| `ipaProof.cr` | `` `0x${string}` ``[] |
| `ipaProof.finalEvaluation` | `` `0x${string}` `` |
| <a id="otherstems"></a> `otherStems` | `` `0x${string}` ``[] |
