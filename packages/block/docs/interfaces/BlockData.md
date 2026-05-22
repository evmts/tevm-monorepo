[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / BlockData

# Interface: BlockData

Defined in: [packages/block/src/types.ts:195](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L195)

A block's data.

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="executionwitness"></a> `executionWitness?` | [`VerkleExecutionWitness`](VerkleExecutionWitness.md) \| `null` | EIP-6800: Verkle proof data payload shape (experimental). Tevm does not execute Verkle/state-witness blocks. | [packages/block/src/types.ts:208](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L208) |
| <a id="header"></a> `header?` | [`HeaderData`](HeaderData.md) | Header data for the block | [packages/block/src/types.ts:199](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L199) |
| <a id="requests"></a> `requests?` | [`ClRequest`](../classes/ClRequest.md)[] | - | [packages/block/src/types.ts:203](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L203) |
| <a id="transactions"></a> `transactions?` | (`LegacyTxData` \| `AccessList2930TxData` \| `FeeMarketEIP1559TxData` \| `BlobEIP4844TxData` \| `EOACode7702TxData`)[] | - | [packages/block/src/types.ts:200](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L200) |
| <a id="uncleheaders"></a> `uncleHeaders?` | [`HeaderData`](HeaderData.md)[] | - | [packages/block/src/types.ts:201](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L201) |
| <a id="withdrawals"></a> `withdrawals?` | `WithdrawalData`[] | - | [packages/block/src/types.ts:202](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L202) |
