[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [block](../README.md) / VerkleExecutionWitness

# Interface: VerkleExecutionWitness

Defined in: packages/block/types/types.d.ts:89

Experimental, object format could eventual change.
An object that provides the state and proof necessary for verkle stateless execution

## Properties

### stateDiff

> **stateDiff**: [`VerkleStateDiff`](VerkleStateDiff.md)[]

Defined in: packages/block/types/types.d.ts:95

An array of state diffs.
Each item corresponding to state accesses or state modifications of the block.
In the current design, it also contains the resulting state of the block execution (post-state).

***

### verkleProof

> **verkleProof**: [`VerkleProof`](VerkleProof.md)

Defined in: packages/block/types/types.d.ts:100

The verkle proof for the block.
Proves that the provided stateDiff belongs to the canonical verkle tree.
