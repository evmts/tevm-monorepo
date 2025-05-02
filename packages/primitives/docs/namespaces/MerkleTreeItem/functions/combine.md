[**@tevm/primitives**](../../../README.md)

***

[@tevm/primitives](../../../globals.md) / [MerkleTreeItem](../README.md) / combine

# Function: combine()

> **combine**(`left`, `right`): `Effect`\<[`B256`](../../B256/type-aliases/B256.md), `Error`\>

Defined in: [MerkleTreeItem.ts:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/primitives/src/MerkleTreeItem.ts#L30)

Concatenates and hashes two MerkleTreeItems to create their parent node

## Parameters

### left

[`B256`](../../B256/type-aliases/B256.md)

The left child.

### right

[`B256`](../../B256/type-aliases/B256.md)

The right child.

## Returns

`Effect`\<[`B256`](../../B256/type-aliases/B256.md), `Error`\>
