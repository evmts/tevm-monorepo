[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [block](../README.md) / VerkleExecutionWitness

# Interface: VerkleExecutionWitness

Experimental, object format could eventual change.
An object that provides Verkle state-witness payload data.
Tevm preserves the type for payload parsing, but Verkle/EIP-6800 execution is unsupported.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="statediff"></a> `stateDiff` | [`VerkleStateDiff`](VerkleStateDiff.md)[] | An array of state diffs. Each item corresponding to state accesses or state modifications of the block. In the current design, it also contains the resulting state of the block execution (post-state). |
| <a id="verkleproof"></a> `verkleProof` | [`VerkleProof`](VerkleProof.md) | The verkle proof for the block. Proves that the provided stateDiff belongs to the canonical verkle tree. |
