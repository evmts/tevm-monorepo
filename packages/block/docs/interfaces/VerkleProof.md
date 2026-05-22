[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / VerkleProof

# Interface: VerkleProof

Defined in: [packages/block/src/types.ts:90](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L90)

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

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="commitmentsbypath"></a> `commitmentsByPath` | `` `0x${string}` ``[] | [packages/block/src/types.ts:91](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L91) |
| <a id="d"></a> `d` | `` `0x${string}` `` | [packages/block/src/types.ts:92](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L92) |
| <a id="depthextensionpresent"></a> `depthExtensionPresent` | `` `0x${string}` `` | [packages/block/src/types.ts:93](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L93) |
| <a id="ipaproof"></a> `ipaProof` | `object` | [packages/block/src/types.ts:94](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L94) |
| `ipaProof.cl` | `` `0x${string}` ``[] | [packages/block/src/types.ts:95](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L95) |
| `ipaProof.cr` | `` `0x${string}` ``[] | [packages/block/src/types.ts:96](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L96) |
| `ipaProof.finalEvaluation` | `` `0x${string}` `` | [packages/block/src/types.ts:97](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L97) |
| <a id="otherstems"></a> `otherStems` | `` `0x${string}` ``[] | [packages/block/src/types.ts:99](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L99) |
