[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [block](../README.md) / JsonRpcBlock

# Interface: JsonRpcBlock

## Properties

### baseFeePerGas?

> `optional` **baseFeePerGas**: `string`

#### Source

packages/block/types/types.d.ts:220

***

### blobGasUsed?

> `optional` **blobGasUsed**: `string`

#### Source

packages/block/types/types.d.ts:223

***

### difficulty

> **difficulty**: `string`

#### Source

packages/block/types/types.d.ts:211

***

### excessBlobGas?

> `optional` **excessBlobGas**: `string`

#### Source

packages/block/types/types.d.ts:224

***

### executionWitness?

> `optional` **executionWitness**: `null` \| [`VerkleExecutionWitness`](VerkleExecutionWitness.md)

#### Source

packages/block/types/types.d.ts:226

***

### extraData

> **extraData**: `string`

#### Source

packages/block/types/types.d.ts:213

***

### gasLimit

> **gasLimit**: `string`

#### Source

packages/block/types/types.d.ts:215

***

### gasUsed

> **gasUsed**: `string`

#### Source

packages/block/types/types.d.ts:216

***

### hash

> **hash**: `string`

#### Source

packages/block/types/types.d.ts:201

***

### logsBloom

> **logsBloom**: `string`

#### Source

packages/block/types/types.d.ts:206

***

### miner

> **miner**: `string`

#### Source

packages/block/types/types.d.ts:210

***

### mixHash?

> `optional` **mixHash**: `string`

#### Source

packages/block/types/types.d.ts:203

***

### nonce

> **nonce**: `string`

#### Source

packages/block/types/types.d.ts:204

***

### number

> **number**: `string`

#### Source

packages/block/types/types.d.ts:200

***

### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `string`

#### Source

packages/block/types/types.d.ts:225

***

### parentHash

> **parentHash**: `string`

#### Source

packages/block/types/types.d.ts:202

***

### receiptsRoot

> **receiptsRoot**: `string`

#### Source

packages/block/types/types.d.ts:209

***

### requests?

> `optional` **requests**: `string`[]

#### Source

packages/block/types/types.d.ts:228

***

### requestsRoot?

> `optional` **requestsRoot**: `string`

#### Source

packages/block/types/types.d.ts:227

***

### sha3Uncles

> **sha3Uncles**: `string`

#### Source

packages/block/types/types.d.ts:205

***

### size

> **size**: `string`

#### Source

packages/block/types/types.d.ts:214

***

### stateRoot

> **stateRoot**: `string`

#### Source

packages/block/types/types.d.ts:208

***

### timestamp

> **timestamp**: `string`

#### Source

packages/block/types/types.d.ts:217

***

### totalDifficulty

> **totalDifficulty**: `string`

#### Source

packages/block/types/types.d.ts:212

***

### transactions

> **transactions**: (`string` \| [`JsonRpcTx`](../../tx/interfaces/JsonRpcTx.md))[]

#### Source

packages/block/types/types.d.ts:218

***

### transactionsRoot

> **transactionsRoot**: `string`

#### Source

packages/block/types/types.d.ts:207

***

### uncles

> **uncles**: \`0x$\{string\}\`[] \| `string`[]

#### Source

packages/block/types/types.d.ts:219

***

### withdrawals?

> `optional` **withdrawals**: [`JsonRpcWithdrawal`](../../utils/interfaces/JsonRpcWithdrawal.md)[]

#### Source

packages/block/types/types.d.ts:221

***

### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `string`

#### Source

packages/block/types/types.d.ts:222
