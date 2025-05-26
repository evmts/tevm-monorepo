[**@tevm/block**](../README.md)

***

[@tevm/block](../globals.md) / JsonRpcBlock

# Interface: JsonRpcBlock

Defined in: [packages/block/src/types.ts:465](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L465)

## Properties

### baseFeePerGas?

> `optional` **baseFeePerGas**: `string`

Defined in: [packages/block/src/types.ts:486](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L486)

***

### blobGasUsed?

> `optional` **blobGasUsed**: `string`

Defined in: [packages/block/src/types.ts:489](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L489)

***

### difficulty

> **difficulty**: `string`

Defined in: [packages/block/src/types.ts:477](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L477)

***

### excessBlobGas?

> `optional` **excessBlobGas**: `string`

Defined in: [packages/block/src/types.ts:490](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L490)

***

### executionWitness?

> `optional` **executionWitness**: `null` \| [`VerkleExecutionWitness`](VerkleExecutionWitness.md)

Defined in: [packages/block/src/types.ts:492](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L492)

***

### extraData

> **extraData**: `string`

Defined in: [packages/block/src/types.ts:479](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L479)

***

### gasLimit

> **gasLimit**: `string`

Defined in: [packages/block/src/types.ts:481](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L481)

***

### gasUsed

> **gasUsed**: `string`

Defined in: [packages/block/src/types.ts:482](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L482)

***

### hash

> **hash**: `string`

Defined in: [packages/block/src/types.ts:467](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L467)

***

### logsBloom

> **logsBloom**: `string`

Defined in: [packages/block/src/types.ts:472](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L472)

***

### miner

> **miner**: `string`

Defined in: [packages/block/src/types.ts:476](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L476)

***

### mixHash?

> `optional` **mixHash**: `string`

Defined in: [packages/block/src/types.ts:469](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L469)

***

### nonce

> **nonce**: `string`

Defined in: [packages/block/src/types.ts:470](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L470)

***

### number

> **number**: `string`

Defined in: [packages/block/src/types.ts:466](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L466)

***

### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `string`

Defined in: [packages/block/src/types.ts:491](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L491)

***

### parentHash

> **parentHash**: `string`

Defined in: [packages/block/src/types.ts:468](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L468)

***

### receiptsRoot

> **receiptsRoot**: `string`

Defined in: [packages/block/src/types.ts:475](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L475)

***

### requests?

> `optional` **requests**: `string`[]

Defined in: [packages/block/src/types.ts:494](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L494)

***

### requestsRoot?

> `optional` **requestsRoot**: `string`

Defined in: [packages/block/src/types.ts:493](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L493)

***

### sha3Uncles

> **sha3Uncles**: `string`

Defined in: [packages/block/src/types.ts:471](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L471)

***

### size

> **size**: `string`

Defined in: [packages/block/src/types.ts:480](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L480)

***

### stateRoot

> **stateRoot**: `string`

Defined in: [packages/block/src/types.ts:474](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L474)

***

### timestamp

> **timestamp**: `string`

Defined in: [packages/block/src/types.ts:483](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L483)

***

### totalDifficulty

> **totalDifficulty**: `string`

Defined in: [packages/block/src/types.ts:478](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L478)

***

### transactions

> **transactions**: (`string` \| `JSONRPCTx`)[]

Defined in: [packages/block/src/types.ts:484](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L484)

***

### transactionsRoot

> **transactionsRoot**: `string`

Defined in: [packages/block/src/types.ts:473](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L473)

***

### uncles

> **uncles**: `string`[] \| `` `0x${string}` ``[]

Defined in: [packages/block/src/types.ts:485](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L485)

***

### withdrawals?

> `optional` **withdrawals**: `JSONRPCWithdrawal`[]

Defined in: [packages/block/src/types.ts:487](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L487)

***

### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `string`

Defined in: [packages/block/src/types.ts:488](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L488)
