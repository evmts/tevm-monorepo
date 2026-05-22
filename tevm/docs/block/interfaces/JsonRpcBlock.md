[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [block](../README.md) / JsonRpcBlock

# Interface: JsonRpcBlock

## Properties

| Property | Type |
| ------ | ------ |
| <a id="basefeepergas"></a> `baseFeePerGas?` | `string` |
| <a id="blobgasused"></a> `blobGasUsed?` | `string` |
| <a id="difficulty"></a> `difficulty` | `string` |
| <a id="excessblobgas"></a> `excessBlobGas?` | `string` |
| <a id="executionwitness"></a> `executionWitness?` | [`VerkleExecutionWitness`](VerkleExecutionWitness.md) \| `null` |
| <a id="extradata"></a> `extraData` | `string` |
| <a id="gaslimit"></a> `gasLimit` | `string` |
| <a id="gasused"></a> `gasUsed` | `string` |
| <a id="hash"></a> `hash` | `string` |
| <a id="logsbloom"></a> `logsBloom` | `string` |
| <a id="miner"></a> `miner` | `string` |
| <a id="mixhash"></a> `mixHash?` | `string` |
| <a id="nonce"></a> `nonce` | `string` |
| <a id="number"></a> `number` | `string` |
| <a id="parentbeaconblockroot"></a> `parentBeaconBlockRoot?` | `string` |
| <a id="parenthash"></a> `parentHash` | `string` |
| <a id="receiptsroot"></a> `receiptsRoot` | `string` |
| <a id="requests"></a> `requests?` | `string`[] |
| <a id="requestsroot"></a> `requestsRoot?` | `string` |
| <a id="sha3uncles"></a> `sha3Uncles` | `string` |
| <a id="size"></a> `size` | `string` |
| <a id="stateroot"></a> `stateRoot` | `string` |
| <a id="timestamp"></a> `timestamp` | `string` |
| <a id="totaldifficulty"></a> `totalDifficulty` | `string` |
| <a id="transactions"></a> `transactions` | (`string` \| [`JsonRpcTx`](../../tx/interfaces/JsonRpcTx.md))[] |
| <a id="transactionsroot"></a> `transactionsRoot` | `string` |
| <a id="uncles"></a> `uncles` | `` `0x${string}` ``[] \| `string`[] |
| <a id="withdrawals"></a> `withdrawals?` | [`JsonRpcWithdrawal`](../../utils/interfaces/JsonRpcWithdrawal.md)[] |
| <a id="withdrawalsroot"></a> `withdrawalsRoot?` | `string` |
