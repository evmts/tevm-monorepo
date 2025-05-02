[**@tevm/primitives**](../../../README.md)

***

[@tevm/primitives](../../../globals.md) / [MerkleTreeItem](../README.md) / verifyProof

# Function: verifyProof()

> **verifyProof**(`item`, `proof`, `root`, `index`): `Effect`\<`boolean`, `Error`\>

Defined in: [MerkleTreeItem.ts:46](https://github.com/evmts/tevm-monorepo/blob/main/packages/primitives/src/MerkleTreeItem.ts#L46)

Verifies a Merkle proof for a given item and root

## Parameters

### item

[`B256`](../../B256/type-aliases/B256.md)

The item to verify.

### proof

[`B256`](../../B256/type-aliases/B256.md)[]

The proof nodes (from leaf to root).

### root

[`B256`](../../B256/type-aliases/B256.md)

The Merkle root.

### index

`number`

The index of the item in the tree (for determining left/right position).

## Returns

`Effect`\<`boolean`, `Error`\>
