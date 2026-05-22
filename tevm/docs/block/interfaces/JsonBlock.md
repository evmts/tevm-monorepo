[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [block](../README.md) / JsonBlock

# Interface: JsonBlock

An object with the block's data represented as strings.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="executionwitness"></a> `executionWitness?` | [`VerkleExecutionWitness`](VerkleExecutionWitness.md) \| `null` | - |
| <a id="header"></a> `header?` | [`JsonHeader`](JsonHeader.md) | Header data for the block |
| <a id="requests"></a> `requests?` | `` `0x${string}` ``[] \| `null` | - |
| <a id="transactions"></a> `transactions?` | [`JsonTx`](../../tx/interfaces/JsonTx.md)[] | - |
| <a id="uncleheaders"></a> `uncleHeaders?` | [`JsonHeader`](JsonHeader.md)[] | - |
| <a id="withdrawals"></a> `withdrawals?` | [`JsonRpcWithdrawal`](../../utils/interfaces/JsonRpcWithdrawal.md)[] | - |
