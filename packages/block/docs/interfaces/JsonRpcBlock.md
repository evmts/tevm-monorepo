[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / JsonRpcBlock

# Interface: JsonRpcBlock

Defined in: [packages/block/src/types.ts:465](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L465)

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| <a id="basefeepergas"></a> `baseFeePerGas?` | `string` | [packages/block/src/types.ts:486](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L486) |
| <a id="blobgasused"></a> `blobGasUsed?` | `string` | [packages/block/src/types.ts:489](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L489) |
| <a id="difficulty"></a> `difficulty` | `string` | [packages/block/src/types.ts:477](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L477) |
| <a id="excessblobgas"></a> `excessBlobGas?` | `string` | [packages/block/src/types.ts:490](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L490) |
| <a id="executionwitness"></a> `executionWitness?` | [`VerkleExecutionWitness`](VerkleExecutionWitness.md) \| `null` | [packages/block/src/types.ts:492](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L492) |
| <a id="extradata"></a> `extraData` | `string` | [packages/block/src/types.ts:479](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L479) |
| <a id="gaslimit"></a> `gasLimit` | `string` | [packages/block/src/types.ts:481](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L481) |
| <a id="gasused"></a> `gasUsed` | `string` | [packages/block/src/types.ts:482](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L482) |
| <a id="hash"></a> `hash` | `string` | [packages/block/src/types.ts:467](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L467) |
| <a id="logsbloom"></a> `logsBloom` | `string` | [packages/block/src/types.ts:472](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L472) |
| <a id="miner"></a> `miner` | `string` | [packages/block/src/types.ts:476](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L476) |
| <a id="mixhash"></a> `mixHash?` | `string` | [packages/block/src/types.ts:469](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L469) |
| <a id="nonce"></a> `nonce` | `string` | [packages/block/src/types.ts:470](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L470) |
| <a id="number"></a> `number` | `string` | [packages/block/src/types.ts:466](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L466) |
| <a id="parentbeaconblockroot"></a> `parentBeaconBlockRoot?` | `string` | [packages/block/src/types.ts:491](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L491) |
| <a id="parenthash"></a> `parentHash` | `string` | [packages/block/src/types.ts:468](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L468) |
| <a id="receiptsroot"></a> `receiptsRoot` | `string` | [packages/block/src/types.ts:475](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L475) |
| <a id="requests"></a> `requests?` | `string`[] | [packages/block/src/types.ts:494](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L494) |
| <a id="requestsroot"></a> `requestsRoot?` | `string` | [packages/block/src/types.ts:493](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L493) |
| <a id="sha3uncles"></a> `sha3Uncles` | `string` | [packages/block/src/types.ts:471](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L471) |
| <a id="size"></a> `size` | `string` | [packages/block/src/types.ts:480](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L480) |
| <a id="stateroot"></a> `stateRoot` | `string` | [packages/block/src/types.ts:474](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L474) |
| <a id="timestamp"></a> `timestamp` | `string` | [packages/block/src/types.ts:483](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L483) |
| <a id="totaldifficulty"></a> `totalDifficulty` | `string` | [packages/block/src/types.ts:478](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L478) |
| <a id="transactions"></a> `transactions` | (`string` \| `JSONRPCTx`)[] | [packages/block/src/types.ts:484](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L484) |
| <a id="transactionsroot"></a> `transactionsRoot` | `string` | [packages/block/src/types.ts:473](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L473) |
| <a id="uncles"></a> `uncles` | `string`[] \| `` `0x${string}` ``[] | [packages/block/src/types.ts:485](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L485) |
| <a id="withdrawals"></a> `withdrawals?` | `JSONRPCWithdrawal`[] | [packages/block/src/types.ts:487](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L487) |
| <a id="withdrawalsroot"></a> `withdrawalsRoot?` | `string` | [packages/block/src/types.ts:488](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L488) |
