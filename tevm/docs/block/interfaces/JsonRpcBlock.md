[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [block](../README.md) / JsonRpcBlock

# Interface: JsonRpcBlock

Defined in: tevm-monorepo/packages/block/types/types.d.ts:442

## Properties

### baseFeePerGas?

> `optional` **baseFeePerGas?**: `string`

Defined in: tevm-monorepo/packages/block/types/types.d.ts:463

***

### blobGasUsed?

> `optional` **blobGasUsed?**: `string`

Defined in: tevm-monorepo/packages/block/types/types.d.ts:466

***

### difficulty

> **difficulty**: `string`

Defined in: tevm-monorepo/packages/block/types/types.d.ts:454

***

### excessBlobGas?

> `optional` **excessBlobGas?**: `string`

Defined in: tevm-monorepo/packages/block/types/types.d.ts:467

***

### executionWitness?

> `optional` **executionWitness?**: [`VerkleExecutionWitness`](VerkleExecutionWitness.md) \| `null`

Defined in: tevm-monorepo/packages/block/types/types.d.ts:469

***

### extraData

> **extraData**: `string`

Defined in: tevm-monorepo/packages/block/types/types.d.ts:456

***

### gasLimit

> **gasLimit**: `string`

Defined in: tevm-monorepo/packages/block/types/types.d.ts:458

***

### gasUsed

> **gasUsed**: `string`

Defined in: tevm-monorepo/packages/block/types/types.d.ts:459

***

### hash

> **hash**: `string`

Defined in: tevm-monorepo/packages/block/types/types.d.ts:444

***

### logsBloom

> **logsBloom**: `string`

Defined in: tevm-monorepo/packages/block/types/types.d.ts:449

***

### miner

> **miner**: `string`

Defined in: tevm-monorepo/packages/block/types/types.d.ts:453

***

### mixHash?

> `optional` **mixHash?**: `string`

Defined in: tevm-monorepo/packages/block/types/types.d.ts:446

***

### nonce

> **nonce**: `string`

Defined in: tevm-monorepo/packages/block/types/types.d.ts:447

***

### number

> **number**: `string`

Defined in: tevm-monorepo/packages/block/types/types.d.ts:443

***

### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot?**: `string`

Defined in: tevm-monorepo/packages/block/types/types.d.ts:468

***

### parentHash

> **parentHash**: `string`

Defined in: tevm-monorepo/packages/block/types/types.d.ts:445

***

### receiptsRoot

> **receiptsRoot**: `string`

Defined in: tevm-monorepo/packages/block/types/types.d.ts:452

***

### requests?

> `optional` **requests?**: `string`[]

Defined in: tevm-monorepo/packages/block/types/types.d.ts:471

***

### requestsRoot?

> `optional` **requestsRoot?**: `string`

Defined in: tevm-monorepo/packages/block/types/types.d.ts:470

***

### sha3Uncles

> **sha3Uncles**: `string`

Defined in: tevm-monorepo/packages/block/types/types.d.ts:448

***

### size

> **size**: `string`

Defined in: tevm-monorepo/packages/block/types/types.d.ts:457

***

### stateRoot

> **stateRoot**: `string`

Defined in: tevm-monorepo/packages/block/types/types.d.ts:451

***

### timestamp

> **timestamp**: `string`

Defined in: tevm-monorepo/packages/block/types/types.d.ts:460

***

### totalDifficulty

> **totalDifficulty**: `string`

Defined in: tevm-monorepo/packages/block/types/types.d.ts:455

***

### transactions

> **transactions**: (`string` \| [`JsonRpcTx`](../../tx/interfaces/JsonRpcTx.md))[]

Defined in: tevm-monorepo/packages/block/types/types.d.ts:461

***

### transactionsRoot

> **transactionsRoot**: `string`

Defined in: tevm-monorepo/packages/block/types/types.d.ts:450

***

### uncles

> **uncles**: `` `0x${string}` ``[] \| `string`[]

Defined in: tevm-monorepo/packages/block/types/types.d.ts:462

***

### withdrawals?

> `optional` **withdrawals?**: [`JsonRpcWithdrawal`](../../utils/interfaces/JsonRpcWithdrawal.md)[]

Defined in: tevm-monorepo/packages/block/types/types.d.ts:464

***

### withdrawalsRoot?

> `optional` **withdrawalsRoot?**: `string`

Defined in: tevm-monorepo/packages/block/types/types.d.ts:465
