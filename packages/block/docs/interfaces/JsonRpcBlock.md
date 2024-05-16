[**@tevm/block**](../README.md) • **Docs**

***

[@tevm/block](../globals.md) / JsonRpcBlock

# Interface: JsonRpcBlock

## Properties

### baseFeePerGas?

> `optional` **baseFeePerGas**: `string`

#### Source

[types.ts:243](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L243)

***

### blobGasUsed?

> `optional` **blobGasUsed**: `string`

#### Source

[types.ts:246](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L246)

***

### difficulty

> **difficulty**: `string`

#### Source

[types.ts:234](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L234)

***

### excessBlobGas?

> `optional` **excessBlobGas**: `string`

#### Source

[types.ts:247](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L247)

***

### executionWitness?

> `optional` **executionWitness**: `null` \| [`VerkleExecutionWitness`](VerkleExecutionWitness.md)

#### Source

[types.ts:249](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L249)

***

### extraData

> **extraData**: `string`

#### Source

[types.ts:236](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L236)

***

### gasLimit

> **gasLimit**: `string`

#### Source

[types.ts:238](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L238)

***

### gasUsed

> **gasUsed**: `string`

#### Source

[types.ts:239](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L239)

***

### hash

> **hash**: `string`

#### Source

[types.ts:224](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L224)

***

### logsBloom

> **logsBloom**: `string`

#### Source

[types.ts:229](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L229)

***

### miner

> **miner**: `string`

#### Source

[types.ts:233](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L233)

***

### mixHash?

> `optional` **mixHash**: `string`

#### Source

[types.ts:226](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L226)

***

### nonce

> **nonce**: `string`

#### Source

[types.ts:227](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L227)

***

### number

> **number**: `string`

#### Source

[types.ts:223](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L223)

***

### parentBeaconBlockRoot?

> `optional` **parentBeaconBlockRoot**: `string`

#### Source

[types.ts:248](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L248)

***

### parentHash

> **parentHash**: `string`

#### Source

[types.ts:225](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L225)

***

### receiptsRoot

> **receiptsRoot**: `string`

#### Source

[types.ts:232](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L232)

***

### requests?

> `optional` **requests**: `string`[]

#### Source

[types.ts:251](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L251)

***

### requestsRoot?

> `optional` **requestsRoot**: `string`

#### Source

[types.ts:250](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L250)

***

### sha3Uncles

> **sha3Uncles**: `string`

#### Source

[types.ts:228](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L228)

***

### size

> **size**: `string`

#### Source

[types.ts:237](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L237)

***

### stateRoot

> **stateRoot**: `string`

#### Source

[types.ts:231](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L231)

***

### timestamp

> **timestamp**: `string`

#### Source

[types.ts:240](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L240)

***

### totalDifficulty

> **totalDifficulty**: `string`

#### Source

[types.ts:235](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L235)

***

### transactions

> **transactions**: (`string` \| `JsonRpcTx`)[]

#### Source

[types.ts:241](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L241)

***

### transactionsRoot

> **transactionsRoot**: `string`

#### Source

[types.ts:230](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L230)

***

### uncles

> **uncles**: \`0x$\{string\}\`[] \| `string`[]

#### Source

[types.ts:242](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L242)

***

### withdrawals?

> `optional` **withdrawals**: `JsonRpcWithdrawal`[]

#### Source

[types.ts:244](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L244)

***

### withdrawalsRoot?

> `optional` **withdrawalsRoot**: `string`

#### Source

[types.ts:245](https://github.com/evmts/tevm-monorepo/blob/main/packages/block/src/types.ts#L245)
