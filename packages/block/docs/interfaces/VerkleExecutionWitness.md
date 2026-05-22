[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / VerkleExecutionWitness

# Interface: VerkleExecutionWitness

Defined in: [packages/block/src/types.ts:150](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L150)

Experimental, object format could eventual change.
An object that provides Verkle state-witness payload data.
Tevm preserves the type for payload parsing, but Verkle/EIP-6800 execution is unsupported.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="statediff"></a> `stateDiff` | [`VerkleStateDiff`](VerkleStateDiff.md)[] | An array of state diffs. Each item corresponding to state accesses or state modifications of the block. In the current design, it also contains the resulting state of the block execution (post-state). | [packages/block/src/types.ts:156](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L156) |
| <a id="verkleproof"></a> `verkleProof` | [`VerkleProof`](VerkleProof.md) | The verkle proof for the block. Proves that the provided stateDiff belongs to the canonical verkle tree. | [packages/block/src/types.ts:161](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L161) |
