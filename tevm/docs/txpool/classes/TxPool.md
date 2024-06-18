[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [txpool](../README.md) / TxPool

# Class: TxPool

Tx pool (mempool)

## Memberof

module:service

## Constructors

### new TxPool()

> **new TxPool**(`options`): [`TxPool`](TxPool.md)

Create new tx pool

#### Parameters

• **options**: `TxPoolOptions`

constructor parameters

#### Returns

[`TxPool`](TxPool.md)

#### Source

packages/txpool/types/TxPool.d.ts:67

## Properties

### BLOCKS\_BEFORE\_TARGET\_HEIGHT\_ACTIVATION

> **BLOCKS\_BEFORE\_TARGET\_HEIGHT\_ACTIVATION**: `number`

Activate before chain head is reached to start
tx pool preparation (sorting out included txs)

#### Source

packages/txpool/types/TxPool.d.ts:53

***

### HANDLED\_CLEANUP\_TIME\_LIMIT

> **HANDLED\_CLEANUP\_TIME\_LIMIT**: `number`

Number of minutes to forget about handled
txs (for cleanup/memory reasons)

#### Source

packages/txpool/types/TxPool.d.ts:62

***

### POOLED\_STORAGE\_TIME\_LIMIT

> **POOLED\_STORAGE\_TIME\_LIMIT**: `number`

Number of minutes to keep txs in the pool

#### Source

packages/txpool/types/TxPool.d.ts:57

***

### \_cleanupInterval

> `private` **\_cleanupInterval**: `any`

#### Source

packages/txpool/types/TxPool.d.ts:28

***

### \_logInterval

> `private` **\_logInterval**: `any`

#### Source

packages/txpool/types/TxPool.d.ts:29

***

### handled

> `private` **handled**: `any`

Map for handled tx hashes
(have been added to the pool at some point)

This is meant to be a superset of the tx pool
so at any point it time containing minimally
all txs from the pool.

#### Source

packages/txpool/types/TxPool.d.ts:48

***

### normalizedGasPrice

> `private` **normalizedGasPrice**: `any`

Helper to return a normalized gas price across different
transaction types. Providing the baseFee param returns the
priority tip, and omitting it returns the max total fee.

#### Param

The tx

#### Param

Provide a baseFee to subtract from the legacy
gasPrice to determine the leftover priority tip.

#### Source

packages/txpool/types/TxPool.d.ts:129

***

### opened

> `private` **opened**: `any`

#### Source

packages/txpool/types/TxPool.d.ts:26

***

### pool

> **pool**: `Map`\<`string`, `TxPoolObject`[]\>

The central pool dataset.

Maps an address to a `TxPoolObject`

#### Source

packages/txpool/types/TxPool.d.ts:35

***

### running

> **running**: `boolean`

#### Source

packages/txpool/types/TxPool.d.ts:27

***

### txGasPrice

> `private` **txGasPrice**: `any`

Returns the GasPrice object to provide information of the tx' gas prices

#### Param

Tx to use

#### Source

packages/txpool/types/TxPool.d.ts:135

***

### txsInPool

> **txsInPool**: `number`

The number of txs currently in the pool

#### Source

packages/txpool/types/TxPool.d.ts:39

***

### validate

> `private` **validate**: `any`

Validates a transaction against the pool and other constraints

#### Param

The tx to validate

#### Source

packages/txpool/types/TxPool.d.ts:81

***

### validateTxGasBump

> `private` **validateTxGasBump**: `any`

#### Source

packages/txpool/types/TxPool.d.ts:76

***

### vm

> `private` **vm**: `any`

#### Source

packages/txpool/types/TxPool.d.ts:25

## Methods

### \_logPoolStats()

> **\_logPoolStats**(): `void`

#### Returns

`void`

#### Source

packages/txpool/types/TxPool.d.ts:165

***

### add()

> **add**(`tx`, `requireSignature`?, `skipBalance`?): `Promise`\<`void`\>

Adds a tx to the pool.

If there is a tx in the pool with the same address and
nonce it will be replaced by the new tx, if it has a sufficient gas bump.
This also verifies certain constraints, if these are not met, tx will not be added to the pool.

#### Parameters

• **tx**: [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md)

Transaction

• **requireSignature?**: `boolean`

• **skipBalance?**: `boolean`

#### Returns

`Promise`\<`void`\>

#### Source

packages/txpool/types/TxPool.d.ts:101

***

### addUnverified()

> **addUnverified**(`tx`): `Promise`\<`void`\>

Adds a tx to the pool without validating it.

If there is a tx in the pool with the same address and
nonce it will be replaced by the new tx, if it has a sufficient gas bump.
This also verifies certain constraints, if these are not met, tx will not be added to the pool.

#### Parameters

• **tx**: [`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md)

Transaction

#### Returns

`Promise`\<`void`\>

#### Source

packages/txpool/types/TxPool.d.ts:91

***

### cleanup()

> **cleanup**(): `void`

Regular tx pool cleanup

#### Returns

`void`

#### Source

packages/txpool/types/TxPool.d.ts:120

***

### close()

> **close**(): `void`

Close pool

#### Returns

`void`

#### Source

packages/txpool/types/TxPool.d.ts:164

***

### getByHash()

> **getByHash**(`txHashes`): ([`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md))[]

Returns the available txs from the pool

#### Parameters

• **txHashes**: readonly `Uint8Array`[]

#### Returns

([`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md))[]

Array with tx objects

#### Source

packages/txpool/types/TxPool.d.ts:107

***

### getBySenderAddress()

> **getBySenderAddress**(`address`): `Promise`\<`TxPoolObject`[]\>

#### Parameters

• **address**: [`EthjsAddress`](../../utils/classes/EthjsAddress.md)

#### Returns

`Promise`\<`TxPoolObject`[]\>

#### Source

packages/txpool/types/TxPool.d.ts:136

***

### open()

> **open**(): `boolean`

Open pool

#### Returns

`boolean`

#### Source

packages/txpool/types/TxPool.d.ts:71

***

### removeByHash()

> **removeByHash**(`txHash`): `void`

Removes the given tx from the pool

#### Parameters

• **txHash**: `string`

Hash of the transaction

#### Returns

`void`

#### Source

packages/txpool/types/TxPool.d.ts:112

***

### removeNewBlockTxs()

> **removeNewBlockTxs**(`newBlocks`): `void`

Remove txs included in the latest blocks from the tx pool

#### Parameters

• **newBlocks**: [`Block`](../../block/classes/Block.md)[]

#### Returns

`void`

#### Source

packages/txpool/types/TxPool.d.ts:116

***

### start()

> **start**(): `boolean`

Start tx processing

#### Returns

`boolean`

#### Source

packages/txpool/types/TxPool.d.ts:75

***

### stop()

> **stop**(): `boolean`

Stop pool execution

#### Returns

`boolean`

#### Source

packages/txpool/types/TxPool.d.ts:160

***

### txsByPriceAndNonce()

> **txsByPriceAndNonce**(`baseFee`?): `Promise`\<([`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md))[]\>

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

• **baseFee?**

Provide a baseFee to exclude txs with a lower gasPrice

• **baseFee.allowedBlobs?**: `number`

• **baseFee.baseFee?**: `bigint`

#### Returns

`Promise`\<([`TypedTransaction`](../../tx/type-aliases/TypedTransaction.md) \| [`ImpersonatedTx`](../../tx/interfaces/ImpersonatedTx.md))[]\>

#### Source

packages/txpool/types/TxPool.d.ts:153
