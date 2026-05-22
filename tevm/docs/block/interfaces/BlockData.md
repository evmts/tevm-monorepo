[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [block](../README.md) / BlockData

# Interface: BlockData

A block's data.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="executionwitness"></a> `executionWitness?` | [`VerkleExecutionWitness`](VerkleExecutionWitness.md) \| `null` | EIP-6800: Verkle proof data payload shape (experimental). Tevm does not execute Verkle/state-witness blocks. |
| <a id="header"></a> `header?` | [`HeaderData`](HeaderData.md) | Header data for the block |
| <a id="requests"></a> `requests?` | [`ClRequest`](../classes/ClRequest.md)[] | - |
| <a id="transactions"></a> `transactions?` | (`LegacyTxData` \| `AccessList2930TxData` \| `FeeMarketEIP1559TxData` \| `BlobEIP4844TxData` \| [`EOACodeEIP7702TxData`](../../tx/interfaces/EOACodeEIP7702TxData.md))[] | - |
| <a id="uncleheaders"></a> `uncleHeaders?` | [`HeaderData`](HeaderData.md)[] | - |
| <a id="withdrawals"></a> `withdrawals?` | [`WithdrawalData`](../../utils/type-aliases/WithdrawalData.md)[] | - |
