---
editUrl: false
next: false
prev: false
title: "VerkleExecutionWitness"
---

Experimental, object format could eventual change.
An object that provides the state and proof necessary for verkle stateless execution

## Properties

### stateDiff

> **stateDiff**: [`VerkleStateDiff`](/reference/tevm/block/interfaces/verklestatediff/)[]

An array of state diffs.
Each item corresponding to state accesses or state modifications of the block.
In the current design, it also contains the resulting state of the block execution (post-state).

#### Source

[types.ts:100](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L100)

***

### verkleProof

> **verkleProof**: [`VerkleProof`](/reference/tevm/block/interfaces/verkleproof/)

The verkle proof for the block.
Proves that the provided stateDiff belongs to the canonical verkle tree.

#### Source

[types.ts:105](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L105)
