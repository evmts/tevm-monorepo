**@tevm/txpool** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > TxPool

# Class: TxPool

Tx pool (mempool)

## Memberof

module:service

## Constructors

### new TxPool(options)

> **new TxPool**(`options`): [`TxPool`](TxPool.md)

Create new tx pool

#### Parameters

▪ **options**: `TxPoolOptions`

constructor parameters

#### Source

[TxPool.ts:124](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L124)

## Properties

### BLOCKS\_BEFORE\_TARGET\_HEIGHT\_ACTIVATION

> **BLOCKS\_BEFORE\_TARGET\_HEIGHT\_ACTIVATION**: `number` = `20`

Activate before chain head is reached to start
tx pool preparation (sorting out included txs)

#### Source

[TxPool.ts:107](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L107)

***

### HANDLED\_CLEANUP\_TIME\_LIMIT

> **HANDLED\_CLEANUP\_TIME\_LIMIT**: `number` = `60`

Number of minutes to forget about handled
txs (for cleanup/memory reasons)

#### Source

[TxPool.ts:118](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L118)

***

### POOLED\_STORAGE\_TIME\_LIMIT

> **POOLED\_STORAGE\_TIME\_LIMIT**: `number` = `20`

Number of minutes to keep txs in the pool

#### Source

[TxPool.ts:112](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L112)

***

### \_cleanupInterval

> **`private`** **\_cleanupInterval**: `undefined` \| `Timer`

#### Source

[TxPool.ts:78](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L78)

***

### \_logInterval

> **`private`** **\_logInterval**: `undefined` \| `Timer`

#### Source

[TxPool.ts:79](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L79)

***

### handled

> **`private`** **handled**: `Map`\<`string`, `HandledObject`\>

Map for handled tx hashes
(have been added to the pool at some point)

This is meant to be a superset of the tx pool
so at any point it time containing minimally
all txs from the pool.

#### Source

[TxPool.ts:101](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L101)

***

### opened

> **`private`** **opened**: `boolean`

#### Source

[TxPool.ts:73](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L73)

***

### pool

> **pool**: `Map`\<`string`, `TxPoolObject`[]\>

The central pool dataset.

Maps an address to a `TxPoolObject`

#### Source

[TxPool.ts:86](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L86)

***

### running

> **running**: `boolean`

#### Source

[TxPool.ts:75](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L75)

***

### txsInPool

> **txsInPool**: `number`

The number of txs currently in the pool

#### Source

[TxPool.ts:91](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L91)

***

### vm

> **`private`** **vm**: `TevmVm`

#### Source

[TxPool.ts:71](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L71)

## Methods

### \_logPoolStats()

> **\_logPoolStats**(): `void`

#### Source

[TxPool.ts:615](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L615)

***

### add()

> **add**(`tx`): `Promise`\<`void`\>

Adds a tx to the pool.

If there is a tx in the pool with the same address and
nonce it will be replaced by the new tx, if it has a sufficient gas bump.
This also verifies certain constraints, if these are not met, tx will not be added to the pool.

#### Parameters

▪ **tx**: `TypedTransaction`

Transaction

#### Source

[TxPool.ts:330](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L330)

***

### addUnverified()

> **addUnverified**(`tx`): `Promise`\<`void`\>

Adds a tx to the pool without validating it.

If there is a tx in the pool with the same address and
nonce it will be replaced by the new tx, if it has a sufficient gas bump.
This also verifies certain constraints, if these are not met, tx will not be added to the pool.

#### Parameters

▪ **tx**: `TypedTransaction`

Transaction

#### Source

[TxPool.ts:300](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L300)

***

### cleanup()

> **cleanup**(): `void`

Regular tx pool cleanup

#### Source

[TxPool.ts:398](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L398)

***

### close()

> **close**(): `void`

Close pool

#### Source

[TxPool.ts:608](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L608)

***

### getByHash()

> **getByHash**(`txHashes`): `TypedTransaction`[]

Returns the available txs from the pool

#### Parameters

▪ **txHashes**: `Uint8Array`[]

#### Returns

Array with tx objects

#### Source

[TxPool.ts:340](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L340)

***

### normalizedGasPrice()

> **`private`** **normalizedGasPrice**(`tx`, `baseFee`?): `bigint`

Helper to return a normalized gas price across different
transaction types. Providing the baseFee param returns the
priority tip, and omitting it returns the max total fee.

#### Parameters

▪ **tx**: `TypedTransaction`

The tx

▪ **baseFee?**: `bigint`

Provide a baseFee to subtract from the legacy
gasPrice to determine the leftover priority tip.

#### Source

[TxPool.ts:432](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L432)

***

### open()

> **open**(): `boolean`

Open pool

#### Source

[TxPool.ts:137](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L137)

***

### removeByHash()

> **removeByHash**(`txHash`): `void`

Removes the given tx from the pool

#### Parameters

▪ **txHash**: `string`

Hash of the transaction

#### Source

[TxPool.ts:363](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L363)

***

### removeNewBlockTxs()

> **removeNewBlockTxs**(`newBlocks`): `void`

Remove txs included in the latest blocks from the tx pool

#### Parameters

▪ **newBlocks**: `Block`[]

#### Source

[TxPool.ts:385](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L385)

***

### start()

> **start**(): `boolean`

Start tx processing

#### Source

[TxPool.ts:149](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L149)

***

### stop()

> **stop**(): `boolean`

Stop pool execution

#### Source

[TxPool.ts:597](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L597)

***

### txGasPrice()

> **`private`** **txGasPrice**(`tx`): `GasPrice`

Returns the GasPrice object to provide information of the tx' gas prices

#### Parameters

▪ **tx**: `TypedTransaction`

Tx to use

#### Returns

Gas price (both tip and max fee)

#### Source

[TxPool.ts:453](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L453)

***

### txsByPriceAndNonce()

> **txsByPriceAndNonce**(`vm`, `__namedParameters`): `Promise`\<`TypedTransaction`[]\>

Returns eligible txs to be mined sorted by price in such a way that the
nonce orderings within a single account are maintained.

Note, this is not as trivial as it seems from the first look as there are three
different criteria that need to be taken into account (price, nonce, account
match), which cannot be done with any plain sorting method, as certain items
cannot be compared without context.

This method first sorts the separates the list of transactions into individual
sender accounts and sorts them by nonce. After the account nonce ordering is
satisfied, the results are merged back together by price, always comparing only
the head transaction from each account. This is done via a heap to keep it fast.

#### Parameters

▪ **vm**: `TevmVm`

▪ **\_\_namedParameters**: `object`= `{}`

▪ **\_\_namedParameters.allowedBlobs?**: `number`

▪ **\_\_namedParameters.baseFee?**: `bigint`

#### Source

[TxPool.ts:494](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L494)

***

### validate()

> **`private`** **validate**(`tx`, `isLocalTransaction`): `Promise`\<`void`\>

Validates a transaction against the pool and other constraints

#### Parameters

▪ **tx**: `TypedTransaction`

The tx to validate

▪ **isLocalTransaction**: `boolean`= `false`

#### Source

[TxPool.ts:203](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L203)

***

### validateTxGasBump()

> **`private`** **validateTxGasBump**(`existingTx`, `addedTx`): `void`

#### Parameters

▪ **existingTx**: `TypedTransaction`

▪ **addedTx**: `TypedTransaction`

#### Source

[TxPool.ts:162](https://github.com/evmts/tevm-monorepo/blob/main/packages/txpool/src/TxPool.ts#L162)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
