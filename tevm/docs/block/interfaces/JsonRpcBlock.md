[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [block](../README.md) / JsonRpcBlock

# Interface: JsonRpcBlock

Defined in: packages/block/types/types.d.ts:199

## Properties

### baseFeePerGas?

> `optional` **baseFeePerGas**: `string`

Defined in: packages/block/types/types.d.ts:220

***

### blobGasUsed?

> `optional` **blobGasUsed**: `string`

Defined in: packages/block/types/types.d.ts:223

***

### difficulty

> **difficulty**: `string`

Defined in: packages/block/types/types.d.ts:211

***

### excessBlobGas?

> `optional` **excessBlobGas**: `string`

Defined in: packages/block/types/types.d.ts:224

***

### executionWitness?

> `optional` **executionWitness**: `null` \| [`VerkleExecutionWitness`](VerkleExecutionWitness.md)

Defined in: packages/block/types/types.d.ts:226

***

### extraData

> **extraData**: `string`

Defined in: packages/block/types/types.d.ts:213

***

### gasLimit

> **gasLimit**: `string`

Defined in: packages/block/types/types.d.ts:215

***

### gasUsed

> **gasUsed**: `string`

Defined in: packages/block/types/types.d.ts:216

***

### hash

> **hash**: `string`

Defined in: packages/block/types/types.d.ts:201

***

### logsBloom

> **logsBloom**: `string`

Defined in: packages/block/types/types.d.ts:206

***

### miner

> **miner**: `string`

Defined in: packages/block/types/types.d.ts:210

***

### mixHash?

> `optional` **mixHash**: `string`

Defined in: packages/block/types/types.d.ts:203

***

### nonce

> **nonce**: `string`

Defined in: packages/block/types/types.d.ts:204

***

### number

> **number**: `string`

Defined in: packages/block/types/types.d.ts:200

***

### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `string`

Defined in: packages/block/types/types.d.ts:225

***

### parentHash

> **parentHash**: `string`

Defined in: packages/block/types/types.d.ts:202

***

### receiptsRoot

> **receiptsRoot**: `string`

Defined in: packages/block/types/types.d.ts:209

***

### requests?

> `optional` **requests**: `string`[]

Defined in: packages/block/types/types.d.ts:228

***

### requestsRoot?

> `optional` **requestsRoot**: `string`

Defined in: packages/block/types/types.d.ts:227

***

### sha3Uncles

> **sha3Uncles**: `string`

Defined in: packages/block/types/types.d.ts:205

***

### size

> **size**: `string`

Defined in: packages/block/types/types.d.ts:214

***

### stateRoot

> **stateRoot**: `string`

Defined in: packages/block/types/types.d.ts:208

***

### timestamp

> **timestamp**: `string`

Defined in: packages/block/types/types.d.ts:217

***

### totalDifficulty

> **totalDifficulty**: `string`

Defined in: packages/block/types/types.d.ts:212

***

### transactions

> **transactions**: (`string` \| [`JsonRpcTx`](../../tx/interfaces/JsonRpcTx.md))[]

Defined in: packages/block/types/types.d.ts:218

***

### transactionsRoot

> **transactionsRoot**: `string`

Defined in: packages/block/types/types.d.ts:207

***

### uncles

> **uncles**: `string`[] \| `` `0x${string}` ``[]

Defined in: packages/block/types/types.d.ts:219

***

### withdrawals?

> `optional` **withdrawals**: [`JsonRpcWithdrawal`](../../utils/interfaces/JsonRpcWithdrawal.md)[]

Defined in: packages/block/types/types.d.ts:221

***

### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `string`

Defined in: packages/block/types/types.d.ts:222
